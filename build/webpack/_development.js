import webpack            from 'webpack'
import webpackConfig      from './_base'
import config             from '../../config'
import ExtractTextPlugin  from 'extract-text-webpack-plugin'

webpackConfig.devtool = 'source-map'
webpackConfig.entry.app.unshift(
  `webpack-dev-server/client?${config.get('webpack_public_path')}`,
  `webpack/hot/dev-server`
)

webpackConfig.output.publicPath = `${config.get('webpack_public_path')}/`

webpackConfig.plugins.push(
  new ExtractTextPlugin('[name].css')
)

const commonChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function (module) {
    // 该配置假定你引入的 vendor 存在于 node_modules 目录中
    return module.context && module.context.indexOf('node_modules') !== -1;
  }
})

commonChunkPlugin.__KARMA_IGNORE__ = true
webpackConfig.plugins.push(commonChunkPlugin)

webpackConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
)

export default webpackConfig
