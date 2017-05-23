import React from 'react'
import { renderRoutes } from 'react-router-config'

class App extends React.Component {
  render () {
    return (
      <div>{renderRoutes(this.props.route.routes)}</div>
    )
  }
}

export default App
module.exports = exports['default']
