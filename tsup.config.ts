import { defineConfig } from 'tsup'
import 'dotenv/config'

export default defineConfig({
  // 1. 入口文件
  entry: ['src/server.ts'],

  // 2. 输出格式：Node 20 原生支持 ESM，建议只保留 esm
  format: ['esm'],

  // 3. 目标环境：利用 Node 20 的原生特性，减少 polyfill
  target: 'node20',

  // 4. 基础配置
  outDir: 'dist',
  clean: true, // 每次构建前清空 dist
  tsconfig: 'tsconfig.json',

  // 5. 调试与源码映射
  // 生产环境建议开启 sourcemap 以便通过报错定位源码行数
  sourcemap: true,

  // 6. 代码分割
  // 服务端单入口通常不需要拆包 (splitting: true 在 ESM 下有用，但在 node 环境处理复杂依赖时有时会出错)
  splitting: false,

  // true: 将所有代码打包进一个文件 (适合 Serverless/Lambda)
  // false: 保留 require/import 语句，不打包依赖 (适合 Docker/传统服务器部署，利用 Docker 缓存层)
  // 通常建议设为 true，但配合 skipNodeModulesBundle 使用
  bundle: true,

  // 服务端部署通常会在服务器执行 npm install。
  // 打包 node_modules 会导致构建极慢，且 native 模块(如 sharp, bcrypt) 打包后无法运行。
  skipNodeModulesBundle: true,

  // ESM 模式下没有 __dirname 和 __filename，开启此选项会自动注入 polyfill
  shims: true,

  // 生产环境开启，减小体积。注意：排查问题需要配合 sourcemap
  minify: process.env.NODE_ENV === 'production',

  // 移除未使用的代码
  treeshake: true,
})
