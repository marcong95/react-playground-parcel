import { createContext } from 'react'

export const GaugeContext = createContext({
  bandwidth: 68,
  setBandwidth: () => {}
})
