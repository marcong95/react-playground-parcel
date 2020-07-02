import React from 'react'
import { ZeitProvider, CssBaseline } from '@zeit-ui/react'

import AppLayout from './components/common/AppLayout'

export default function ReactPlayground() {
  return (
    <ZeitProvider>
      <CssBaseline />
      <AppLayout />
    </ZeitProvider>
  )
}
