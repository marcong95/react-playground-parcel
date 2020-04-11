import React from 'react'
import ReactDOM from 'react-dom'
import App from './src/App'

// imported but transformed into #_app_<hash>
import './src/styles/index.styl'

ReactDOM.render(<App />, document.getElementById('app'))
