#!/bin/bash

# 版本更新脚本
# 用法: ./scripts/update-version.sh [patch|minor|major]

set -e  # 遇到错误时退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 显示使用方法
show_usage() {
    echo "用法: $0 [版本类型]"
    echo ""
    echo "版本类型:"
    echo "  patch  - 补丁版本 (1.0.0 -> 1.0.1) - 用于bug修复"
    echo "  minor  - 次要版本 (1.0.0 -> 1.1.0) - 用于新功能"
    echo "  major  - 主要版本 (1.0.0 -> 2.0.0) - 用于重大更改"
    echo ""
    echo "示例:"
    echo "  $0 patch"
    echo "  $0 minor"
    echo "  $0 major"
}

# 检查参数
if [ $# -eq 0 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_usage
    exit 0
fi

VERSION_TYPE=$1

# 验证版本类型
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_message $RED "❌ 错误: 无效的版本类型 '$VERSION_TYPE'"
    show_usage
    exit 1
fi

# 检查是否在git仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_message $RED "❌ 错误: 当前目录不是git仓库"
    exit 1
fi

# 检查工作目录是否干净
if [ -n "$(git status --porcelain)" ]; then
    print_message $YELLOW "⚠️  警告: 工作目录有未提交的更改"
    echo "未提交的文件:"
    git status --porcelain
    echo ""
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_message $YELLOW "📤 操作已取消"
        exit 0
    fi
fi

# 获取当前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_message $BLUE "📦 当前版本: $CURRENT_VERSION"

# 更新版本
print_message $YELLOW "🔄 正在更新版本..."
npm version $VERSION_TYPE --no-git-tag-version

# 获取新版本
NEW_VERSION=$(node -p "require('./package.json').version")
print_message $GREEN "✨ 新版本: $NEW_VERSION"

# 提交更改
print_message $YELLOW "📝 正在提交更改..."
git add package.json

# 检查是否有package-lock.json并添加
if [ -f "package-lock.json" ]; then
    git add package-lock.json
fi

git commit -m "chore: bump version to $NEW_VERSION"

# 创建标签
print_message $YELLOW "🏷️  正在创建标签..."
git tag "v$NEW_VERSION"

# 推送更改和标签
print_message $YELLOW "📤 正在推送到远程仓库..."
git push origin main || git push origin master
git push origin "v$NEW_VERSION"

print_message $GREEN "🎉 版本更新完成!"
print_message $BLUE "📋 版本: $CURRENT_VERSION → $NEW_VERSION"
print_message $BLUE "🏷️  标签: v$NEW_VERSION"
print_message $YELLOW "🤖 GitHub Actions将自动发布到npm..."
print_message $BLUE "🔗 查看发布进度: https://github.com/hahaha-zsq/dadandiaoming-cli/actions"

# 可选: 打开浏览器查看Actions
if command -v open > /dev/null 2>&1; then
    read -p "是否打开浏览器查看GitHub Actions? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://github.com/hahaha-zsq/dadandiaoming-cli/actions"
    fi
fi 