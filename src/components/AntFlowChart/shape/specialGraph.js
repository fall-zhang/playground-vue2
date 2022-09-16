import { Graph, Shape } from '@antv/x6'
import Vue from 'vue'
import '@antv/x6-vue-shape'
import DevShape from './Dev.vue'
import FactoryShape from './Factory.vue'

const { Rect, Circle } = Shape
export let CircleBlueWord = circleBlueWord()
export let GreenWord = greenWord()
export let Breaker = breaker()
dev()
factory()
// 运行时加载的图形
// 未用到的图形
// circleBlue()
// circleGreen()
// circleRed()
// circleYellow()
// circleBlack()
const specialInfo = getSpecialInfo()
function getSpecialInfo() {
  const direction = ['top', 'right', 'bottom', 'left']
  let portItems = []
  direction.forEach((item, index) => {
    portItems.push({ id: item + '-1', group: 'around' })
    portItems.push({
      id: 'blank-' + 2 * index,
      group: 'around',
      attrs: {
        circle: {
          r: 3,
          magnet: false,
          stroke: 'transparent',
          fill: 'transparent',
          strokeWidth: 0
        }
      }
    })
    portItems.push({ id: item + '-2', group: 'around' })
    portItems.push({ id: item + '-3', group: 'around' })
    portItems.push({
      id: 'blank-' + (2 * index + 1),
      group: 'around',
      attrs: {
        circle: {
          r: 3,
          magnet: false,
          stroke: 'transparent',
          fill: 'transparent',
          strokeWidth: 0
        }
      }
    })
    portItems.push({ id: item + '-4', group: 'around' })
  })
  const node = {
    width: 80, // Number，可选，节点大小的 width 值
    height: 80, // Number，可选，节点大小的 height 值
    // angle: -8,
    ports: {
      groups: {
        around: {
          attrs: {
            circle: {
              magnet: true,
              r: 6
            }
          },
          position: {
            name: 'ellipseSpread',
            args: { start: -38 }
          }
        }
      },
      items: portItems
    }
  }
  return node
}
export function getStationCircle(label, config) {
  let configObj = {}
  if (config && typeof config == 'object') {
    configObj = config
  }
  return new Shape.Circle({
    x: 0, // Number，必选，节点位置的 x 值
    y: 0, // Number，必选，节点位置的 y 值
    label: label || '默认标签',
    zIndex: 2,
    ...specialInfo,
    ...configObj
  })
}
function circleBlueWord() {
  return Circle.define({
    shape: 'circle-blue-word',
    width: 25,
    height: 25,
    attrs: {
      body: {
        strokeWidth: 0,
        fill: '#407aee',
        stroke: '#407aee'
      },
      label: {
        fill: '#fff',
        fontSize: 12,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle'
      }
    }
  })
}
function greenWord() {
  return Rect.define({
    shape: 'green-word',
    width: 60,
    height: 30,
    attrs: {
      body: {
        strokeWidth: 0,
        fill: 'rgba(255, 255, 255, 0)'
      },
      label: {
        fill: '#367e6d',
        text: '文本'
      },
      text: {
        fontSize: 16
      }
    }
  })
}
function breaker() {
  return Rect.define({
    shape: 'breaker',
    width: 50,
    height: 25,
    attrs: {
      body: {
        strokeWidth: 2,
        stroke: '#808080',
        fill: 'rgba(255, 255, 255, 0)'
      }
    }
  })
}
function dev() {
  const Dev = Vue.extend(DevShape)
  Graph.registerVueComponent(
    'dev',
    {
      template: '<Dev />',
      components: {
        Dev
      }
    },
    true
  )
}
function factory() {
  const Factory = Vue.extend(FactoryShape)
  Graph.registerVueComponent(
    'factory',
    {
      template: '<Factory />',
      components: {
        Factory
      }
    },
    true
  )
}

// export function circleBlue() {
//   return Circle.define({
//     shape: 'circle-blue',
//     width: 25,
//     height: 25,
//     attrs: {
//       body: {
//         strokeWidth: 0,
//         fill: '#407aee',
//         stroke: '#407aee'
//       }
//     }
//   })
// }
// export function circleGreen() {
//   const CircleGreen = Circle.define({
//     shape: 'circle-green',
//     width: 25,
//     height: 25,
//     attrs: {
//       body: {
//         strokeWidth: 0,
//         fill: '#73f26f',
//         stroke: '#73f26f'
//       }
//     }
//   })

//   return CircleGreen
// }
// export function circleRed() {
//   const CircleRed = Circle.define({
//     shape: 'circle-red',
//     width: 25,
//     height: 25,
//     attrs: {
//       body: {
//         strokeWidth: 0,
//         fill: '#e8694b',
//         stroke: '#e8694b'
//       }
//     }
//   })

//   return CircleRed
// }
// export function circleYellow() {
//   const CircleYellow = Circle.define({
//     shape: 'circle-yellow',
//     width: 25,
//     height: 25,
//     attrs: {
//       body: {
//         strokeWidth: 0,
//         fill: '#f3d854',
//         stroke: '#f3d854'
//       }
//     }
//   })

//   return CircleYellow
// }
// export function circleBlack() {
//   const CircleBlack = Circle.define({
//     shape: 'circle-black',
//     width: 30,
//     height: 30,
//     attrs: {
//       body: {
//         strokeWidth: 0,
//         fill: '#5d5c57',
//         stroke: '#5d5c57'
//       }
//     }
//   })

//   return CircleBlack
// }
