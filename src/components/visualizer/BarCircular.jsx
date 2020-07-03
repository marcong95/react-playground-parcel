import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import { Arc } from '@vx/shape'
import { scaleBand, scaleLinear } from '@vx/scale'

const PALETTES = ['#d92027', '#ff9234', '#ffcd3c', '#35d0ba']

export function Gauge({
  data,
  backgroundOpacity = 0.2,
  ...props
}) {
  const minAngle = 0
  const maxAngle = Math.PI * 1.5

  const radius = 500
  const radiusScale = useMemo(() =>
    scaleBand({
      rangeRound: [radius, radius * 1 / 3],
      domain: data.map(d => d.name),
      padding: 0.15
    }), [radius])
  const angleScale = useMemo(
    () => scaleLinear({
      range: [minAngle, maxAngle],
      // domain: [0, Math.max(...data.map(d => d.value))]
      domain: [0, 1]
    }), [])

  return <svg width="100%"
    height="100%"
    viewBox="0 0 1000 1000"
    preserveAspectRatio="xMinYMin meet"
    {...props}>
    <Group top={radius}
      left={radius}>
      {data.map(({ name, value, max }, idx) => {
        const ratio = value / max
        const innerRadius = radiusScale(name)
        const swipeAngle = angleScale(ratio)

        return <React.Fragment key={`arc-${name}`}>
          <Arc id={`arcbg-${name}`}
            data={Infinity}
            innerRadius={innerRadius}
            outerRadius={innerRadius + radiusScale.bandwidth()}
            startAngle={0}
            endAngle={maxAngle}
            cornerRadius={radiusScale.bandwidth()}
            fill={PALETTES[idx]}
            opacity={backgroundOpacity || 0}/>
          <Arc id={`arc-${name}`}
            data={ratio}
            innerRadius={innerRadius}
            outerRadius={innerRadius + radiusScale.bandwidth()}
            startAngle={0}
            endAngle={swipeAngle}
            cornerRadius={radiusScale.bandwidth()}
            fill={PALETTES[idx]}/>
          <text x="2em"
            y={-innerRadius - radiusScale.bandwidth() / 4}
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
Gauge.propTypes = {
  data: PropTypes.array,
  backgroundOpacity: PropTypes.number
}