import { Shape } from '@antv/x6'
export function getSpecialCircle(label, config) {
  let configObj = {}
  if (config && typeof config == 'object') {
    configObj = config
  }
  return new Shape.Circle({
    x: 500, // Number，必选，节点位置的 x 值
    y: 500, // Number，必选，节点位置的 y 值
    label: label || '',
    zIndex: 2,
    ...node,
    ...configObj
  })
}
const portConifg = {
  attrs: {
    circle: {
      magnet: true,
      r: 6
    }
  },
  position: {
    name: 'top',
    args: {}
  }
}
// let circle = {
//   shape: 'circle',
//   width: 80, // Number，可选，节点大小的 width 值
//   height: 80, // Number，可选，节点大小的 height 值
//   ports: {
//     groups: {
//       top: {
//         attrs: portConifg.attrs,
//         position: {
//           name: 'top',
//           args: {}
//         }
//       },
//       right: {
//         attrs: portConifg.attrs,
//         position: {
//           name: 'right',
//           args: {}
//         }
//       },
//       bottom: {
//         attrs: portConifg.attrs,
//         position: {
//           name: 'bottom',
//           args: {}
//         }
//       },
//       left: {
//         attrs: portConifg.attrs,
//         position: {
//           name: 'left',
//           args: {}
//         }
//       }
//     },
//     items: [
//       { id: 'top-1', group: 'top' },
//       { id: 'top-2', group: 'top' },
//       { id: 'top-3', group: 'top' },
//       { id: 'top-4', group: 'top' },
//       { id: 'right-1', group: 'right' },
//       { id: 'right-2', group: 'right' },
//       { id: 'right-3', group: 'right' },
//       { id: 'right-4', group: 'right' },
//       { id: 'bottom-1', group: 'bottom' },
//       { id: 'bottom-2', group: 'bottom' },
//       { id: 'bottom-3', group: 'bottom' },
//       { id: 'bottom-4', group: 'bottom' },
//       { id: 'left-1', group: 'left' },
//       { id: 'left-2', group: 'left' },
//       { id: 'left-3', group: 'left' },
//       { id: 'left-4', group: 'left' }
//     ]
//   }
// }
const direction = ['top', 'right', 'bottom', 'left']
let portItems = []
direction.forEach((item, index) => {
  portItems.push({ id: item + '-1', group: 'around' })
  portItems.push({
    id: 'blank-' + 2 * index + 1,
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
  portItems.push({ id: item + '-4', group: 'around' })
})
console.log(portItems)

const node = {
  width: 80, // Number，可选，节点大小的 width 值
  height: 80, // Number，可选，节点大小的 height 值
  label: '我我我我', // String，节点标签
  // angle: -8,
  ports: {
    groups: {
      around: {
        // markup: {
        //   tagName: 'circle',
        //   selector: 'body',
        //   angle: -20,
        //   attrs: {
        //     r: 4,
        //     fill: '#fff',
        //     stroke: '#000'
        //     // transform: 'rotate(48deg)'
        //     // transform: -8
        //   }
        // },
        // markup: [{ attrs: { tagName: 'circle', angle: -8 } }]
        attrs: portConifg.attrs,
        position: {
          name: 'ellipseSpread',
          args: { start: -38 }
        }
      }
    },
    items: portItems
  }
}
// [
//   { id: 'left-top-2', group: 'around' },
//   { id: 'top-1', group: 'around' },
//   { id: 'top-2', group: 'around' },
//   { id: 'right-top-1', group: 'around' },
//   { id: 'right-top-2', group: 'around' },
//   { id: 'right-1', group: 'around' },
//   { id: 'right-2', group: 'around' },
//   { id: 'right-bottom-1', group: 'around' },
//   { id: 'right-bottom-2', group: 'around' },
//   { id: 'bottom-1', group: 'around' },
//   { id: 'bottom-2', group: 'around' },
//   { id: 'left-bottom-1', group: 'around' },
//   { id: 'left-bottom-2', group: 'around' },
//   { id: 'left-1', group: 'around' },
//   { id: 'left-2', group: 'around' },
//   { id: 'left-top-1', group: 'around' }
// ]
// [
//   { id: 'left-top-2' },
//   { id: 'top-1' },
//   { id: 'top-2' },
//   { id: 'right-top-1' },
//   { id: 'right-top-2' },
//   { id: 'right-1' },
//   { id: 'right-2' },
//   { id: 'right-bottom-1' },
//   { id: 'right-bottom-2' },
//   { id: 'bottom-1' },
//   { id: 'bottom-2' },
//   { id: 'left-bottom-1' },
//   { id: 'left-bottom-2' },
//   { id: 'left-1' },
//   { id: 'left-2' },
//   { id: 'left-top-1' }
// ]
