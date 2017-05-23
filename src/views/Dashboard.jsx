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
    this.props.getNewsList(1, 1)
  }

  render () {
    const 欢迎语 = "Hello World!"
    return (
      <div>{欢迎语}</div>
    )
  }
}

export default Dashboard
module.exports = exports['default']
