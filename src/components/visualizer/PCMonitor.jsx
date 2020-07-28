import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useSprings, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

import { cartesianToPolar, polarToCartesian } from './utils'
import { GaugeContext } from './contexts'
import { SingularGauge, MultipleGauge } from './BarCircular'

const PALETTES = ['#d92027', '#ff9234', '#ffcd3c', '#35d0ba']

const GaugeContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;

  &::after {
    content: "";
    display: block;
    margin-bottom: 100%;
  }

  & > svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`
const AnimatedMultipleGauge = animated(MultipleGauge)
const AnimatedSingularGauge = animated(SingularGauge)

export default function PCMonitor({
  data,
  ...props
}) {
  const [bandwidth, setBandwidth] = useState(0)
  const [debugData, setDebugData] = useState('')

  const [springProps, set] = useSprings(data.length + 1, () => ({
    transform: 'scale(1)'
  }))
  const dragBind = useDrag(({
    args: [index],
    down,
    movement,
    direction: [dx, dy], // [+/- 0/0.5sqrt(2)/1] * 2
    velocity
  }) => {
    const [, rad] = cartesianToPolar(dx, dy)
    const deg = rad * 180 / Math.PI
    const trigger = velocity > 0.2
    setDebugData({ index, down, movement, deg, velocity, trigger })

    set(i => {
      if (index !== i) return

      return down ? {
        transform: 'scale(0.8)'
      } : {
        transform: 'scale(1)'
      }
    })
  })

  const [multipleGaugeProps, ...singularGaugesProps] = springProps
  return <GaugeContext.Provider value={{ bandwidth, setBandwidth }}>
    <GaugeContainer>
      <AnimatedMultipleGauge data={data}
        palettes={PALETTES}
        {...props}
        {...multipleGaugeProps}
        {...dragBind(0)}/>
      {data.map((item, index) => {
        const [x, y] = polarToCartesian(100, Math.PI / 2 * (index - 1))
        return <AnimatedSingularGauge key={`subgauge-${item.name}`}
          data={item}
          accentColor={PALETTES[index]}
          style={{
            top: `${y}%`,
            left: `${x}%`
          }}
          {...singularGaugesProps[index]}
          {...props}/>
      })}
      <div style={{
        position: 'absolute',
        width: '50%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {Object.entries(debugData).map(([key, val]) => <span key={key}
          style={{
            display: 'inline-block',
            fontSize: '0.5em'
          }}>{key}: {JSON.stringify(val)}</span>)}
      </div>
    </GaugeContainer>
  </GaugeContext.Provider>
}
PCMonitor.propTypes = {
  data: PropTypes.array,
  backgroundOpacity: PropTypes.number
}
