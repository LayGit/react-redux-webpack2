import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as globalActions from '../store/actions/global'

@connect(
    state => state,
    dispatch => bindActionCreators(globalActions, dispatch)
)
class Dashboard extends React.Component {
  componentDidMount() {

  }

  render () {
    const 欢迎语 = "Hello World!"
    return (
      <div className="dashboard"><img src={require('../resources/music.png')} /> {欢迎语}</div>
    )
  }
}

export default Dashboard
module.exports = exports['default']
