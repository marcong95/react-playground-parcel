export function cartesianToPolar(x, y) {
  const angle = Math.atan2(y, x)
  const radius = y / Math.sin(angle)
  return [radius, angle]
}

export function polarToCartesian(radius, angle) {
  const x = radius * Math.cos(angle)
  const y = radius * Math.sin(angle)
  return [x, y].map(v => roundTo(10e-6, v))
}

export function roundTo(base, val) {
  return Math.round(val / base) * base
}
