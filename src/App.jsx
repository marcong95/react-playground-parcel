import React, { Component } from 'react'
import { ZEITUIProvider, CSSBaseline } from '@zeit-ui/react'

import AppLayout from './components/common/AppLayout'

export default class ReactPlayground extends Component {
  render() {
    return (
      <ZEITUIProvider>
        <CSSBaseline />
        <AppLayout />
      </ZEITUIProvider>
    )
  }
}
