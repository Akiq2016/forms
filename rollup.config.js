import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import json from "rollup-plugin-json"
import alias from "rollup-plugin-alias"

let pkg = require("./package.json")
let external = Object.keys(pkg.dependencies)

export default {
  entry: 'src/index.js',
  dest: 'dist/bundle.js',
  format: 'cjs',
  plugins: [
    resolve({ jsnext: true }),
    commonjs(),
    json(),
    babel({ exclude: 'node_modules/**' }),
    alias({ cpn: "./src/components" })
  ],
  external: external,
  sourceMap: true
}