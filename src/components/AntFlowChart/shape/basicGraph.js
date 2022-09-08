import { Shape } from '@antv/x6'
export function getBasicRect(label, config) {
  let configObj = {}
  if (config && typeof config == 'object') {
    configObj = config
  }
  return new Shape.Rect({
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: label,
    zIndex: 2,
    ports: [
      {
        id: 'port1',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2
          }
        }
      }
    ],
    ...configObj
  })
}
export function getBasicCircle(label, config) {
  let configObj = {}
  if (config && typeof config == 'object') {
    configObj = config
  }
  new Shape.Rect({
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: label || '',
    zIndex: 2,
    ...configObj
  })
}
export const getBasicEdge = (from, to) =>
  new Shape.Edge({
    source: from,
    target: to,
    zIndex: 1
  })
