var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var precss = require('precss')

//判断当前运行环境是开发模式还是生产模式
const nodeEnv = process.env.NODE_ENV || 'development'
const isPro = nodeEnv === 'production'

console.log("当前运行环境：", isPro ? 'production' : 'development')

var plugins = [
  new HtmlWebpackPlugin({
    template : path.join(__dirname, "index.html"),
    hash     : true,
    filename : 'index.html',
    minify   : isPro ? {} : false,
    inject   : 'body'
  })
]
var app = [
  'babel-polyfill',
  './src/index'
]
if (isPro) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[hash].js',
      minChunks: function (module) {
        // 该配置假定你引入的 vendor 存在于 node_modules 目录中
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new webpack.DefinePlugin({
      // 定义全局变量
      'process.env':{
        'NODE_ENV': JSON.stringify(nodeEnv)
      }
    }),
    new ExtractTextPlugin('styles.[contenthash].css')
  )
} else {
  app.push('webpack-hot-middleware/client?path=http://localhost:3011/__webpack_hmr&reload=true&noInfo=false&quiet=false')
  plugins.push(
    new webpack.DefinePlugin({
      // 定义全局变量
      'process.env':{
        'NODE_ENV': JSON.stringify(nodeEnv)
      },
      BASE_URL: JSON.stringify('http://localhost:9009'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // 该配置假定你引入的 vendor 存在于 node_modules 目录中
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new ExtractTextPlugin('styles.css')
  )
}

module.exports = {
  devtool: false,
  entry: {
    app: app
  },
  output: {
    filename: isPro ? '[name].[hash].js' : '[name].js',
    path: path.join(__dirname, 'build'),
    publicPath: '/'
  },
  // BASE_URL是全局的api接口访问地址
  plugins,
  // alias是配置全局的路径入口名称，只要涉及到下面配置的文件路径，可以直接用定义的单个字母表示整个路径
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.scss', '.css'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.join(__dirname, './src')
    ]
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: ['babel-loader'],
      exclude: /node_modules/,
      include: path.join(__dirname, 'src')
    }, {
      test: /\.(scss|css)$/,
      use: ExtractTextPlugin.extract({
        use: ["css-loader", "sass-loader", {
          loader: 'postcss-loader',
          options: {
            plugins:[
               require('autoprefixer')({
                 browsers:['last 5 versions']
               })
             ]
          }
        }]
      })
    }, {
      test: /\.(png|jpg|gif|md)$/,
      use: ['file-loader?limit=10000&name=[md5:hash:base64:10].[ext]']
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: ['url-loader?limit=10000&mimetype=image/svg+xml']
    }],
  }
}
