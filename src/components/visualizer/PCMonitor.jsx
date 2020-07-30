import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useSprings, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import useMeasure from 'react-use-measure'

import { cartesianToPolar, polarToCartesian, roundTo } from './utils'
import { GaugeContext } from './contexts'
import { SingularGauge, MultipleGauge } from './BarCircular'

const PALETTES = ['#d92027', '#ff9234', '#ffcd3c', '#35d0ba']

const getViewBox = r => `${-r} ${-r} ${r * 2} ${r * 2}`
const INITIAL_VIEWBOX = getViewBox(500)
const ACTIVE_VIEWBOX = getViewBox(600)

// FIXME: only works when dragging from center to outer
const snapTo = ([x, y], ringRadius, {
  ringPartitions = 4,
  movementThreshold = 0.5
} = {}) => {
  const [radius, angle] = cartesianToPolar(x, y)
  const nearestAngle = roundTo(Math.PI * 2 / ringPartitions, angle)
  console.log(nearestAngle * 180 / Math.PI, radius / ringRadius)
  if (Number.isNaN(radius)) {
    console.error('radius is NaN', x, y, radius, angle)
  }
  if (radius / ringRadius < movementThreshold) {
    return [0, 0]
  } else {
    return polarToCartesian(1, nearestAngle)
  }
}

const GaugeContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  overscroll-behavior-y: contain;

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
  const [el, bounds] = useMeasure()

  const [bandwidth, setBandwidth] = useState(0)
  const [currentCenter, setCurrentCenter] = useState([0, 0])

  const [springProps, setSprings] = useSprings(data.length + 1, i => {
    return {
      top: 0,
      left: 0,
      viewBox: INITIAL_VIEWBOX
    }
  })
  const dragBind = useDrag(({
    down,
    movement: [mx, my],
    memo
  }) => {
    const { width, height } = bounds
    console.log(memo)

    if (down) {
      setSprings({
        top: my / width,
        left: mx / height,
        viewBox: ACTIVE_VIEWBOX
      })
    } else {
      setCurrentCenter(snapTo([mx, my], Math.min(width, height)))
      const [cx, cy] = currentCenter
      setSprings({
        top: cy,
        left: cx,
        viewBox: INITIAL_VIEWBOX
      })
      return currentCenter
    }
  })

  const [multipleGaugeProps, ...singularGaugesProps] = springProps
  const { top, left, ...restSpringProps } = multipleGaugeProps
  return <GaugeContext.Provider value={{ bandwidth, setBandwidth }}>
    <GaugeContainer ref={el}>
      <AnimatedMultipleGauge data={data}
        style={{
          top: top.interpolate(top => `${top * 100}%`),
          left: left.interpolate(left => `${left * 100}%`)
        }}
        palettes={PALETTES}
        {...restSpringProps}
        {...dragBind(0)}
        {...props}/>
      {data.map((item, index) => {
        const [x0, y0] = polarToCartesian(100, Math.PI / 2 * (index - 1))
        const { top, left, ...restSpringProps } = singularGaugesProps[index]
        return <AnimatedSingularGauge key={`subgauge-${item.name}`}
          data={item}
          accentColor={PALETTES[index]}
          style={{
            top: top.interpolate(top => `${y0 + top * 100}%`),
            left: left.interpolate(left => `${x0 + left * 100}%`)
          }}
          {...restSpringProps}
          {...dragBind(index + 1)}
          {...props}/>
      })}
    </GaugeContainer>
  </GaugeContext.Provider>
}
PCMonitor.propTypes = {
  data: PropTypes.array,
  backgroundOpacity: PropTypes.number
}
