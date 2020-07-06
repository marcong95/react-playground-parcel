import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Group } from '@vx/group'
import { Arc } from '@vx/shape'
import { scaleBand, scaleLinear } from '@vx/scale'
import { useSprings, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

import { cartesianToPolar, polarToCartesian } from './utils'

const PALETTES = ['#d92027', '#ff9234', '#ffcd3c', '#35d0ba']

const MIN_ANGLE = 0
const MAX_ANGLE = Math.PI * 1.5
const RADIUS = 500

export function MultipleGauge({
  data,
  scales,
  backgroundOpacity = 0.2,
  ...props
}) {
  const { radius, angle } = scales

  return <svg width="100%"
    height="100%"
    viewBox="0 0 1000 1000"
    preserveAspectRatio="xMinYMin meet"
    {...props}>
    <Group top={RADIUS}
      left={RADIUS}>
      {data.map(({ name, value, max }, idx) => {
        const ratio = value / max
        const innerRadius = radius(name)
        const swipeAngle = angle(ratio)

        return <React.Fragment key={`arc-${name}`}>
          <Arc id={`arcbg-${name}`}
            data={Infinity}
            innerRadius={innerRadius}
            outerRadius={innerRadius + radius.bandwidth()}
            startAngle={0}
            endAngle={MAX_ANGLE}
            cornerRadius={radius.bandwidth()}
            fill={PALETTES[idx]}
            opacity={backgroundOpacity || 0}/>
          <Arc id={`arc-${name}`}
            data={ratio}
            innerRadius={innerRadius}
            outerRadius={innerRadius + radius.bandwidth()}
            startAngle={0}
            endAngle={swipeAngle}
            cornerRadius={radius.bandwidth()}
            fill={PALETTES[idx]}/>
          <text x="2em"
            y={-innerRadius - radius.bandwidth() / 4}
            fontSize="3em">
            <tspan dx="-0.5em"
              textAnchor="end">{name.toUpperCase()}</tspan>
            <tspan dx="1em"
              textAnchor="start">{value}</tspan>
          </text>
        </React.Fragment>
      })}
    </Group>
  </svg>
}
MultipleGauge.propTypes = {
  data: PropTypes.array,
  scales: PropTypes.object,
  backgroundOpacity: PropTypes.number
}

export function SingularGauge({
  data,
  scales,
  accentColor,
  backgroundOpacity = 0.2,
  ...props
}) {
  const { radius, angle } = scales

  const { name, value, max } = data
  const ratio = value / max
  const innerRadius = radius(name)
  const swipeAngle = angle(ratio)

  return <svg width="100%"
    height="100%"
    viewBox="0 0 1000 1000"
    preserveAspectRatio="xMinYMin meet"
    {...props}>

    <Group top={RADIUS}
      left={RADIUS}>
      <Arc id={`arcbg-${name}`}
        data={Infinity}
        innerRadius={innerRadius}
        outerRadius={innerRadius + radius.bandwidth()}
        startAngle={0}
        endAngle={MAX_ANGLE}
        cornerRadius={radius.bandwidth()}
        fill={accentColor}
        opacity={backgroundOpacity || 0}/>
      <Arc id={`arc-${name}`}
        data={ratio}
        innerRadius={innerRadius}
        outerRadius={innerRadius + radius.bandwidth()}
        startAngle={0}
        endAngle={swipeAngle}
        cornerRadius={radius.bandwidth()}
        fill={accentColor}/>
      <text x="2em"
        y={-innerRadius - radius.bandwidth() / 4}
        fontSize="3em">
        <tspan dx="-0.5em"
          textAnchor="end">{name.toUpperCase()}</tspan>
        <tspan dx="1em"
          textAnchor="start">{value}</tspan>
      </text>
    </Group>
  </svg>
}
SingularGauge.propTypes = {
  data: PropTypes.object,
  scales: PropTypes.object,
  accentColor: PropTypes.string,
  backgroundOpacity: PropTypes.number
}

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
  const [debugText, setDebugText] = useState('')

  const radius = useMemo(() =>
    scaleBand({
      rangeRound: [RADIUS, RADIUS * 1 / 3],
      domain: data.map(d => d.name),
      padding: 0.15
    }), [RADIUS])
  const angle = useMemo(
    () => scaleLinear({
      range: [MIN_ANGLE, MAX_ANGLE],
      domain: [0, 1]
    }), [])
  const scales = { radius, angle }

  const [springProps, set] = useSprings(data.length + 1, () => ({
    viewBox: '0 0 1200 1200',
    from: {
      viewBox: '0 0 1000 1000'
    }
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
    setDebugText(JSON.stringify({ index, down, movement, deg, velocity, trigger }))

    set(i => {
      if (index !== i) return

      return {
        viewBox: '0 0 1200 1200'
      }
    })
  })

  return <GaugeContainer>
    <AnimatedMultipleGauge data={data}
      scales={scales}
      {...props}
      {...dragBind(0)}/>
    {data.map((item, index) => {
      const [x, y] = polarToCartesian(100, Math.PI / 2 * (index - 1))
      return <AnimatedSingularGauge key={`subgauge-${item.name}`}
        data={item}
        accentColor={PALETTES[index]}
        scales={scales}
        style={{
          top: `${y}%`,
          left: `${x}%`
        }}
        {...props}/>
    })}
    <span style={{
      display: 'inline-block',
      width: '50%'
    }}>{debugText}</span>
  </GaugeContainer>
}
PCMonitor.propTypes = {
  data: PropTypes.array,
  backgroundOpacity: PropTypes.number
}
