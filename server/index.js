var express = require('express');
var compression = require('compression');
var webpack = require('webpack');
var webpackConfig = require('../webpack.config.js');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require('webpack-hot-middleware');
var app = express();
var path = require('path')
var port = 3011;
// var open = require('open')

var proxy = require('http-proxy-middleware')

const compiler = webpack(webpackConfig);

// gzip压缩，必须放在所有路由之前
app.use(compression());

app.use(webpackDevMiddleware(compiler, {
  historyApiFallback: true,
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  headers: { "X-Custom-Header": "yes" },
  stats: {
    colors: true
  }
}));

app.use(webpackHotMiddleware(compiler));
// app.use(express.static(path.join(__dirname, 'build')))

//现在你只需要执行这一行代码，当你访问需要跨域的api资源时，就可以成功访问到了。
app.use('/api/*', proxy({
    target: 'http://127.0.0.1:8080/lqyy/',
    changeOrigin: true,
    pathRewrite: {
      '^/api' : '/'
    }
}))

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../index.html'))
})

app.listen(port, function(err){
  if (err) {
    console.log('err : ', err)
  } else {
    console.log(`http://localhost:${port}`)
  }
})
