import {  } from '../constants/ActionTypes'

const initialState = {
  news: []
}

export default function global(state = initialState, action) {
  switch (action.type) {
    case 'RECEIVE_NEWS':
      return {...state, news: action.data}
    default:
      return state
  }
}
