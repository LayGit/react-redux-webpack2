import webpack           from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import webpackConfig     from './_base'

webpackConfig.output.filename = '[name].[hash].js'

const commonChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  filename: 'vendor.[hash].js',
  minChunks: function (module) {
    // 该配置假定你引入的 vendor 存在于 node_modules 目录中
    return module.context && module.context.indexOf('node_modules') !== -1;
  }
})

commonChunkPlugin.__KARMA_IGNORE__ = true

webpackConfig.plugins.push(
  commonChunkPlugin,
  new ExtractTextPlugin('[name].[contenthash].css'),
  new webpack.optimize.UglifyJsPlugin()
)

webpackConfig.eslint.failOnError = true

export default webpackConfig
