import 'babel-polyfill'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import path from 'path'
import config from '../../config'

const paths = config.get('utils_paths')
const globals = config.get('globals')

const webpackConfig = {
  devtool: false,
  entry: {
    app: [
      'babel-polyfill',
      paths.src('./index.js'),
    ],
    vendor: config.get('vendor_dependencies')
  },
  output: {
    filename: '[name].js',
    path: paths.dist(''),
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin(config.get('globals'), {
      __CLIENT__ : true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template : paths.src('index.html'),
      hash     : true,
      filename : 'index.html',
      minify   : globals.__PROD__ ? {} : false,
      inject   : 'body'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.scss', '.css'],
    modules: ['node_modules', path.join(__dirname, '../node_modules')]
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: ['babel-loader'],
      exclude: /node_modules/,
      include: paths.src('')
    }, {
      test: /\.(scss|css)$/,
      use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
        fallback: 'style-loader',
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
      }))
    }, {
      test: /\.(png|jpg|gif|md)$/,
      use: ['file-loader?limit=10000&name=[md5:hash:base64:10].[ext]']
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: ['url-loader?limit=10000&mimetype=image/svg+xml']
    }],
  }
}

export default webpackConfig
