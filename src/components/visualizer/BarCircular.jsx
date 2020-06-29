import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import { Arc } from '@vx/shape'
import { scaleBand, scaleLinear } from '@vx/scale'

const PALETTES = ['#d92027', '#ff9234', '#ffcd3c', '#35d0ba']

export function Gauge({
  data,
  width,
  height,
  backgroundOpacity = 0.2,
  ...props
}) {
  const minAngle = 0
  const maxAngle = Math.PI * 1.5

  const radius = useMemo(() => Math.min(width, height) / 2, [width, height])
  const radiusScale = useMemo(() =>
    scaleBand({
      rangeRound: [radius, radius * 1 / 3],
      domain: Object.entries(data).map(d => d[0]),
      padding: 0.15
    }), [radius])
  const angleScale = useMemo(
    () => scaleLinear({
      range: [minAngle, maxAngle],
      // domain: [0, Math.max(...Object.entries(data).map(d => d[1]))]
      domain: [0, 150]
    }), [])

  return <svg width={width}
    height={height}
    {...props}>
    <Group top={height / 2}
      left={width / 2}>
      {Object.entries(data).map(([key, value], idx) => {
        const innerRadius = radiusScale(key)
        const swipeAngle = angleScale(value)

        return <React.Fragment key={`arc-${key}`}>
          <Arc id={`arcbg-${key}`}
            data={Infinity}
            innerRadius={innerRadius}
            outerRadius={innerRadius + radiusScale.bandwidth()}
            startAngle={0}
            endAngle={maxAngle}
            cornerRadius={radiusScale.bandwidth()}
            fill={PALETTES[idx]}
            opacity={backgroundOpacity || 0}/>
          <Arc data={value}
            innerRadius={innerRadius}
            outerRadius={innerRadius + radiusScale.bandwidth()}
            startAngle={0}
            endAngle={swipeAngle}
            cornerRadius={radiusScale.bandwidth()}
            fill={PALETTES[idx]}/>
          <text fontSize="0.75em">
            <textPath href={`#arcbg-${key}`}>
              <tspan dx={10}
                dy={10}>{key} {value}</tspan>
            </textPath>
          </text>
        </React.Fragment>
      })}
    </Group>
  </svg>
}
Gauge.propTypes = {
  data: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  backgroundOpacity: PropTypes.number
}
