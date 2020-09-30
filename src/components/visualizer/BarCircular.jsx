import React, { useMemo, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import { scaleBand, scaleLinear } from '@vx/scale'
import { Arc } from '@vx/shape'

import { GaugeContext } from './contexts'

const MIN_ANGLE = 0
const MAX_ANGLE = Math.PI * 1.5
const RADIUS = 500
const getViewBox = r => `${-r} ${-r} ${r * 2} ${r * 2}`
const INITIAL_VIEWBOX = getViewBox(RADIUS)

const angleScale = scaleLinear({
  range: [MIN_ANGLE, MAX_ANGLE],
  domain: [0, 1]
})

export function MultipleGauge({
  data,
  palettes,
  backgroundOpacity = 0.2,
  ...props
}) {
  const { bandwidth, setBandwidth } = useContext(GaugeContext)
  const radiusScale = useMemo(() =>
    scaleBand({
      rangeRound: [RADIUS, RADIUS * 1 / 3],
      domain: data.map(d => d.name),
      padding: 0.15
    }), [data])
  useEffect(() => {
    setBandwidth(radiusScale.bandwidth())
  }, [data])

  return <svg width="100%"
    height="100%"
    viewBox={INITIAL_VIEWBOX}
    preserveAspectRatio="xMinYMin meet"
    {...props}>
    <Group top={0}
      left={0}>
      {data.map(({ name, value, max }, idx) => {
        const ratio = value / max
        const innerRadius = radiusScale(name)
        const swipeAngle = angleScale(ratio)

        return <React.Fragment key={`arc-${name}`}>
          <Arc id={`arcbg-${name}`}
            data={Infinity}
            innerRadius={innerRadius}
            outerRadius={innerRadius + bandwidth}
            startAngle={MIN_ANGLE}
            endAngle={MAX_ANGLE}
            cornerRadius={bandwidth}
            fill={palettes[idx]}
            opacity={backgroundOpacity || 0}/>
          <Arc id={`arc-${name}`}
            data={ratio}
            innerRadius={innerRadius}
            outerRadius={innerRadius + bandwidth}
            startAngle={0}
            endAngle={swipeAngle}
            cornerRadius={bandwidth}
            fill={palettes[idx]}/>
          <text x="2em"
            y={-innerRadius - bandwidth / 4}
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
  palettes: PropTypes.array,
  backgroundOpacity: PropTypes.number
}

export function SingularGauge({
  data,
  accentColor,
  backgroundOpacity = 0.2,
  ...props
}) {
  const { bandwidth } = useContext(GaugeContext)

  const { name, value, max } = data
  const ratio = value / max
  const innerRadius = RADIUS - bandwidth
  const swipeAngle = angleScale(ratio)

  return <svg width="100%"
    height="100%"
    viewBox={INITIAL_VIEWBOX}
    preserveAspectRatio="xMinYMin meet"
    {...props}>

    <Group top={0}
      left={0}>
      <Arc id={`arcbg-${name}`}
        data={Infinity}
        innerRadius={innerRadius}
        outerRadius={innerRadius + bandwidth}
        startAngle={MIN_ANGLE}
        endAngle={MAX_ANGLE}
        cornerRadius={bandwidth}
        fill={accentColor}
        opacity={backgroundOpacity || 0}/>
      <Arc id={`arc-${name}`}
        data={ratio}
        innerRadius={innerRadius}
        outerRadius={innerRadius + bandwidth}
        startAngle={0}
        endAngle={swipeAngle}
        cornerRadius={bandwidth}
        fill={accentColor}/>
      <text x="2em"
        y={-innerRadius - bandwidth / 4}
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
  accentColor: PropTypes.string,
  backgroundOpacity: PropTypes.number
}
