/**
 * 克隆工具模块
 * 用于从远程仓库克隆模板项目到本地
 */
import simpleGit, { SimpleGitOptions } from "simple-git";
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import { name } from "../../package.json"
import figlet from 'figlet';

/**
 * 克隆远程仓库到本地
 * @param url - 远程仓库地址
 * @param projectName - 项目名称
 * @param options - Git克隆选项，如分支名等
 */
export const clone = async (url: string, projectName: string, options: string[]) => {
    // 获取目标目录的绝对路径
    const targetDir = path.resolve(process.cwd(), projectName);

    // 检查目录是否存在，如果存在则询问是否覆盖
    if (fs.existsSync(targetDir)) {
        console.warn(`目录 ${targetDir} 已存在！`);
        // 使用 prompts 创建交互式命令行提示
        const { overwrite } = await prompts({
            type: 'confirm',
            name: 'overwrite',
            message: `目录 ${projectName} 已存在。是否要覆盖？`,
            initial: false // 默认选择否
        });

        // 如果用户选择不覆盖，则退出程序
        if (!overwrite) {
            console.log('操作已取消');
            process.exit(1);
        }

        // 如果用户确认覆盖，则删除现有目录
        await fs.remove(targetDir);
    }

    // 创建加载动画实例
    const spinner = ora({
        text: '准备克隆模板...',
        spinner: 'dots' // 使用点状加载动画
    }).start();

    try {
        // 配置 Git 选项
        const gitOptions: Partial<SimpleGitOptions> = {
            baseDir: process.cwd(), // 设置基础目录为当前工作目录
            binary: 'git', // 使用 git 命令
            maxConcurrentProcesses: 6, // 最大并发进程数
            trimmed: false, // 不裁剪输出结果
            progress: ({ method, stage, progress }) => {
                // 根据不同阶段显示不同的进度信息
                if (stage === 'receiving' || stage === 'resolving'||stage === '接收对象中' || stage === '处理') {
                    // 创建进度条：已完成部分用实心方块，未完成部分用空心方块
                    const progressBar = '█'.repeat(Math.floor(progress / 4)) + '░'.repeat(25 - Math.floor(progress / 4));
                    spinner.text = `${chalk.cyan('下载进度')} [${chalk.yellow(progressBar)}] ${chalk.green(progress + '%')}`;
                }
            }
        };

        // 初始化 Git 实例
        const git = simpleGit(gitOptions);

        // 克隆仓库
        await git.clone(url, projectName, options);
        spinner.succeed('模板克隆完成');

        // 添加漂亮的欢迎信息
        console.log('\n' + chalk.bold(chalk.cyan('🎉 恭喜！项目创建成功！')));
        console.log('\n' + chalk.bold('📦 项目信息：'));
        console.log(chalk.green('   项目名称：') + chalk.yellow(projectName));
        console.log(chalk.green('   项目路径：') + chalk.yellow(targetDir));

        // 添加分隔线
        console.log('\n' + chalk.gray('─'.repeat(50)) + '\n');

        // 使用 figlet 创建 ASCII 艺术字体的欢迎标题
        console.log('\n' + 
            chalk.cyan(
                figlet.textSync(name, {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                    width: 150
                })
            )
        );
        console.log(chalk.cyan('  让开发变得更简单，更高效！\n'));

        // 添加使用提示信息
        console.log(chalk.bold('🚀 开始使用：'));
        console.log(chalk.green(`   cd ${targetDir}`));
        console.log(chalk.green('   npm install') + chalk.gray(' (或 pnpm)'));
        console.log(chalk.green('   npm run dev') + chalk.gray(' (或 pnpm dev)\n'));

    } catch (error) {
        // 如果发生错误，显示失败信息并退出
        spinner.fail('创建失败');
        console.error(error);
        process.exit(1);
    }
};