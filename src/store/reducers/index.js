import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import global from './global'

const rootReducer = combineReducers({
  routing: routerReducer,
  global,
})

export default rootReducer
