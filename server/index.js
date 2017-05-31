require('babel-core/register')

var express = require('express')
var compress = require('compression')

var app = module.exports = express()
var path = require('path')

var config = require('../config').default
var paths = config.get('utils_paths')

// Express 中间件
var middleware = ['csrf', 'router', 'proxy', 'static', 'error']
middleware.forEach(function (m) {
    middleware.__defineGetter__(m, function () {
        return require('./middleware/' + m);
    });
})

// 主页
var indexPage = ''
if (config.get('env') === 'development') {
  indexPage = 'http://' + config.get('server_host') + ':' + config.get('webpack_port') + '/index.html'
} else {
  indexPage = paths.dist('index.html')
}

app.set('port', config.get('server_port'))
app.set('root', paths.project())
app.set('logger', console)

// gizp压缩
app.use(compress())
// 设置主页
app.use(middleware.router({index: indexPage}))

// 设置反向代理
var serverAPI = config.get("server_api")
if (serverAPI) {
  app.use("/api", middleware.proxy(serverAPI))
}

// 设置中间件
app.use(middleware.static(paths.dist()))
app.use(middleware.error())

if (require.main === module) {
    app.listen(app.get('port'), function() {
        console.log('[%s] Express server listening on port %d',
            app.get('env').toUpperCase(), app.get('port'))
    })
}
