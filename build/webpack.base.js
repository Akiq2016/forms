const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const isDevMode = (() => {
  return (process.env.NODE_ENV.trim() === 'development')
})()

function getScssLoader () {
  const mode = isDevMode ? 'development' : 'production'

  if (mode === 'development') {
    return [
      { loader: "style-loader" },
      { loader: "css-loader", options: { importLoaders: 2 } },
      { loader: 'postcss-loader' },
      { loader: "sass-loader" }
    ]
  } else {
    return ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: { importLoaders: 2, minimize: true, sourceMap: true },
        },
        {
          loader: 'postcss-loader',
          options: { sourceMap: true },
        },
        {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ]
    })
  }
}

module.exports = {
  mode: isDevMode ? 'development' : 'production',
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader" },
      {
        test: /\.scss$/,
        use: getScssLoader()
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.join(__dirname, "../src/index.html") }),
    new ExtractTextPlugin('style.css'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 5555,
    hot: true,
    open: true,
  },
  devtool: 'eval-source-map',
}
