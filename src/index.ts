#!/usr/bin/env node
/**
 * 脚手架入口文件
 * 负责注册和处理命令行命令
 */
import {version} from "../package.json";
import {Command} from 'commander';
import {create} from "./command/create";
import {update} from "./command/update";

// 创建命令行程序实例
const program = new Command('dadandiaoming');

// 注册版本命令
program.version(version, '-v --version', "输出项目目前的版本号")

// 注册更新命令
program.command('update')
    .description('更新脚手架')
    .action(async () => {
        await update()
    })

// 注册创建项目命令
program
    .command('create')
    .argument('[project-name]', '项目名称')
    .description('创建一个新项目')
    .action(async (name) => {
       await create(name)
    });

// 解析命令行参数
program.parse(process.argv);
