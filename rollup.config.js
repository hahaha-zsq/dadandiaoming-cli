// 导入 defineConfig 辅助函数和类型
import { defineConfig } from 'rollup';

// 插件：支持 TypeScript 编译（更稳定的版本）
import typescript from 'rollup-plugin-typescript2';

// 插件：识别第三方模块（如 node_modules 中的包）
import resolve from '@rollup/plugin-node-resolve';

// 插件：将 CommonJS 模块转换为 ES 模块
import commonjs from '@rollup/plugin-commonjs';

// 插件：支持导入 JSON 文件
import json from '@rollup/plugin-json';

// 插件：压缩打包产物，减小体积
import terser from '@rollup/plugin-terser';

// 使用 defineConfig 包裹配置（可获得更好的类型提示）
export default defineConfig(async () => {
  const externals = (await import('rollup-plugin-node-externals')).default;

  return [{
    // 入口文件：你 CLI 项目的主入口，一般在 bin 目录下
    input: 'src/index.ts',

    // 输出配置
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].js',
    },

    // 指定哪些依赖不要打包进去（如 Node 内建模块）
    external: [
      'fs', 'path', 'child_process', 'os', 'tslib',  // 确保 tslib 在这里
      'commander', 'prompts', 'ora', 'chalk', 'fs-extra', 'execa'  // 添加其他外部依赖
    ],

    // 使用的插件列表（会按顺序依次处理）
    plugins: [
      externals({
        devDeps: false,
      }),
      resolve(),       // 解析 Node 模块路径
      commonjs(),      // 支持 require 语法的包
      json(),          // 支持 import json
      typescript({
        tsconfig: './tsconfig.json',              // 使用相对路径的 tsconfig 配置
        useTsconfigDeclarationDir: true           // 使用 tsconfig 中的 `declarationDir`
      }),
      terser()         // 最终压缩代码
    ]
  }];
});
