/**
 * 创建项目命令模块
 * 提供项目模板选择和创建功能
 */
import {TemplateInfo} from "../types";
import prompts from 'prompts';
import {clone} from "../utils/clone";
import {name as VN,version} from "../../package.json"
import chalk from 'chalk';

/**
 * 模板列表配置
 * 包含可用的项目模板信息
 */
export const templateList: Map<string, TemplateInfo> = new Map(
    [
        ['vue', {
            name: 'vue',
            description: 'vue项目模板',
            url: 'https://gitee.com/honghuangdc/soybean-admin.git',
            branch: 'main'
        }],
        ['react', {
            name: 'react',
            description: 'react项目模板',
            url: 'https://github.com/d3george/slash-admin.git',
            branch: 'main'
        }]
    ]
)

/**
 * 检查脚手架版本
 * @param name - 包名
 * @param version - 当前版本号
 */
export const checkVersion = async (name:string,version:string) => {
    try {
        // 获取最新版本信息
        const response = await fetch(`https://registry.npmjs.org/${name}/latest`);
        const data = await response.json();
        const latestVersion = data["dist-tags"].latest;
        
        // 比较版本并提示更新
        if (version !== latestVersion) {
            console.log(chalk.yellow(`检测到新版本 ${latestVersion}，当前版本 ${version}`));
            console.log(chalk.blue('请使用脚手架的更新命令进行更新,\n'));
        }
    } catch (error) {
        console.log(chalk.red('版本检查失败，继续执行...'));
    }
}

/**
 * 创建新项目
 * @param name - 项目名称（可选）
 */
export const create = async (name: string) => {
    // 初始化模版列表，转换为 prompts 选择器可用的格式
    const templateArr = Array.from(templateList).map((item: [string, TemplateInfo]) => {
        const [name, templateInfo] = item;
        return {
            title: name,
            value: name,
            description: templateInfo.description,
        }
    })

    let projectName = name;
    
    // 如果没有提供项目名称，则提示用户输入
    if (!projectName) {
        const response = await prompts({
            type: 'text',
            name: 'projectName',
            message: '请输入项目名称：',
            validate: name => name ? true : '项目名不能为空'
        });
        
        // 如果用户取消输入，则退出程序
        if (!response.projectName) {
            console.log('操作已取消');
            process.exit(1);
        }
        
        projectName = response.projectName;
    }

    // 检查脚手架版本是否需要更新
    await checkVersion(VN,version)

    // 提供模板选择界面
    const template = await prompts({
        type: 'select',
        name: 'value',
        message: '请选择模版',
        choices: templateArr,
        initial: 0 // 默认选择第一个选项
    });

    // 如果用户取消选择，则退出程序
    if (!template.value) {
        console.log('操作已取消');
        process.exit(1);
    }

    // 获取选择的模板信息并开始克隆
    const info = templateList.get(template.value);
    if (info) {
        await clone(info.url, projectName, ['--branch', info.branch]);
    }
}