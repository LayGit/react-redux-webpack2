import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { routes } from './route'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import configureStore from './store/configureStore'

// 导入全局样式
import './styles/global.scss'

// 创建 store
const store = configureStore()

const history = createHistory()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {renderRoutes(routes)}
    </Router>
  </Provider>,
  document.getElementById('root')
)
