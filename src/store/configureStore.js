import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const middleware = routerMiddleware(history)
const logger = createLogger({ collapsed: true })

export default function configureStore(initialState) {
  let store;
  if(process.env.NODE_ENV === 'development') {
    store = createStore(rootReducer, composeWithDevTools(applyMiddleware(
      thunk,
      logger,
      middleware
    )))
  } else {
    store = createStore(rootReducer, composeWithDevTools(applyMiddleware(
      thunk,
      middleware
    )))
  }

  if(module.hot) {
    module.hot.accept('./reducers', () => {
        store.replaceReducer(require('./reducers'))
    })
  }
  return store
}
