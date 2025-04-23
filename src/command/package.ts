import prompts from 'prompts';
import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';

export const pkg = async () => {
    try {
        // 首先设置 npm 镜像源
        const npmSpinner = ora('正在设置 npm 镜像源...').start();
        try {
            await execa('npm', ['config', 'set', 'registry', 'https://registry.npmmirror.com']);
            npmSpinner.succeed('npm 镜像源设置成功');
        } catch (error) {
            npmSpinner.fail('npm 镜像源设置失败');
            console.error(chalk.red(error));
            return;
        }

        const response = await prompts({
            type: 'multiselect',
            name: 'packageManagers',
            message: '请选择要安装的包管理工具（使用空格键选择，回车确认）',
            choices: [
                { title: 'pnpm', value: 'pnpm', selected: true },
                { title: 'yarn', value: 'yarn' }
            ],
            hint: '空格键选择，回车确认'
        });

        if (!response.packageManagers || response.packageManagers.length === 0) {
            return;
        }

        const spinner = ora('正在安装包管理工具...').start();

        try {
            // 依次安装选择的包管理工具
            for (const packageManager of response.packageManagers) {
                spinner.start(`正在安装 ${packageManager}...`);
                await execa('npm', ['install', '-g', packageManager]);
                spinner.succeed(`${packageManager} 安装成功`);

                // 设置镜像源
                spinner.start(`正在为 ${packageManager} 设置镜像源...`);
                if (packageManager === 'pnpm') {
                    await execa('pnpm', ['config', 'set', 'registry', 'https://registry.npmmirror.com']);
                } else {
                    await execa('yarn', ['config', 'set', 'registry', 'https://registry.npmmirror.com']);
                }
                spinner.succeed(`${packageManager} 镜像源设置成功`);
            }

            console.log(chalk.green('\n✨ 所有选中的包管理工具配置完成！'));
            console.log(chalk.cyan('\n已安装的包管理工具：'));
            response.packageManagers.forEach((pm: string) => {
                console.log(chalk.cyan(`- ${pm}`));
            });
            console.log(chalk.cyan('\n所有包管理工具镜像源已统一设置为：https://registry.npmmirror.com'));

        } catch (error) {
            spinner.fail('安装过程中发生错误');
            console.error(chalk.red(error));
        }
    } catch (error) {
        console.error(chalk.red('操作被取消'));
    }
}