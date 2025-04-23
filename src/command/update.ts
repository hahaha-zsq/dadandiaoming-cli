/**
 * 更新命令模块
 * 用于检查和更新脚手架版本
 */
import chalk from 'chalk';
import {name, version} from "../../package.json";
import ora from 'ora';
import { execa } from 'execa';

/**
 * 更新脚手架版本
 * 检查最新版本并自动更新
 */
export const update = async () => {
    // 创建加载动画
    const spinner = ora('正在检查更新...').start();
    
    try {
        // 从 npm 仓库获取最新版本信息
        const response = await fetch(`https://registry.npmjs.org/${name}/latest`);
        const data = await response.json();
        const latestVersion = data["dist-tags"].latest;
        
        // 比较当前版本和最新版本
        if (version === latestVersion) {
            // 如果已是最新版本，显示当前版本信息
            spinner.succeed(chalk.green('当前已是最新版本！'));
            console.log(chalk.blue(`当前版本: ${version}`));
        } else {
            // 如果发现新版本，开始更新流程
            spinner.info(chalk.yellow('发现新版本！'));
            console.log(chalk.blue(`当前版本: ${version}`));
            console.log(chalk.blue(`最新版本: ${latestVersion}`));
            
            spinner.start('正在更新到最新版本...');
            
            try {
                // 首先尝试使用 npm 更新
                await execa('npm', ['install', '-g', `${name}@latest`]);
                spinner.succeed(chalk.green('更新成功！'));
                console.log(chalk.blue(`已更新到最新版本: ${latestVersion}`));
            } catch (npmError) {
                // 如果 npm 更新失败，尝试使用 pnpm
                try {
                    await execa('pnpm', ['add', '-g', `${name}@latest`]);
                    spinner.succeed(chalk.green('更新成功！'));
                    console.log(chalk.blue(`已更新到最新版本: ${latestVersion}`));
                } catch (pnpmError) {
                    // 如果自动更新都失败了，提供手动更新的命令
                    spinner.fail(chalk.red('自动更新失败'));
                    console.log(chalk.yellow('\n请手动执行以下命令更新:'));
                    console.log(chalk.green(`npm install -g ${name}@latest`));
                    console.log(chalk.gray('或'));
                    console.log(chalk.green(`pnpm add -g ${name}@latest`));
                }
            }
        }
    } catch (error) {
        // 如果检查更新失败，显示错误信息
        spinner.fail(chalk.red('检查更新失败'));
        console.error('错误详情:', error);
    }
};