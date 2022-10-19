const path = require("path");

const resolve = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const ts = require("rollup-plugin-typescript2");
const replace = require('rollup-plugin-replace')
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  input: "src/index.ts", // 打包入口
  output: [
    {
      file: "dist/index.js", // 输出的文件
      format: "cjs", // 文件模块规范
    },
  ],
  plugins: [
    commonjs(), // 解析 commonjs规范的模块
    // 打包插件
    resolve(), // 查找和打包node_modules中的第三方模块
    // terser(), // 压缩代码和去除注释
    ts({ // 解析 typescript
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      extensions: [".js", ".ts", ".tsx"], // 解析的扩展名
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('devolpment') }),
  ],
  external: ['react', 'react-dom'],
};
