import { Graph, Shape } from '@antv/x6'
import Dev from './shape/Dev.vue'
import Factory from './shape/Factory.vue'

// const { Rect, Circle, Cylinder, Ellipse, Image } = Shape
const { Rect, Circle } = Shape

let CircleBlueWord = null
export function circleBlueWord() {
  if (CircleBlueWord) {
    return CircleBlueWord
  }
  CircleBlueWord = Circle.define({
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
  return CircleBlueWord
}
// 原方法
// export function circleBlueWord() {
//   const CircleBlueWord = Circle.define({
//     shape: 'circle-blue-word',
//     width: 25,
//     height: 25,
//     attrs: {
//       body: {
//         strokeWidth: 0,
//         fill: '#407aee',
//         stroke: '#407aee',
//       },
//       label: {
//         fill: '#fff',
//         fontSize: 12,
//         textAnchor: 'middle',
//         textVerticalAnchor: 'middle',
//       }
//     },
//   })

//   return CircleBlueWord
// }
export function circleBlue() {
  const CircleBlue = Circle.define({
    shape: 'circle-blue',
    width: 25,
    height: 25,
    attrs: {
      body: {
        strokeWidth: 0,
        fill: '#407aee',
        stroke: '#407aee'
      }
    }
  })

  return CircleBlue
}

export function circleGreen() {
  const CircleGreen = Circle.define({
    shape: 'circle-green',
    width: 25,
    height: 25,
    attrs: {
      body: {
        strokeWidth: 0,
        fill: '#73f26f',
        stroke: '#73f26f'
      }
    }
  })

  return CircleGreen
}

export function circleRed() {
  const CircleRed = Circle.define({
    shape: 'circle-red',
    width: 25,
    height: 25,
    attrs: {
      body: {
        strokeWidth: 0,
        fill: '#e8694b',
        stroke: '#e8694b'
      }
    }
  })

  return CircleRed
}

export function circleYellow() {
  const CircleYellow = Circle.define({
    shape: 'circle-yellow',
    width: 25,
    height: 25,
    attrs: {
      body: {
        strokeWidth: 0,
        fill: '#f3d854',
        stroke: '#f3d854'
      }
    }
  })

  return CircleYellow
}

export function greenWord() {
  const GreenWord = Rect.define({
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

  return GreenWord
}

export function breaker() {
  const Breaker = Rect.define({
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

  return Breaker
}

export function circleBlack() {
  const CircleBlack = Circle.define({
    shape: 'circle-black',
    width: 30,
    height: 30,
    attrs: {
      body: {
        strokeWidth: 0,
        fill: '#5d5c57',
        stroke: '#5d5c57'
      }
    }
  })

  return CircleBlack
}

export function dev() {
  Graph.registerVueComponent(
    'dev',
    {
      template: `<Dev />`,
      components: {
        Dev
      }
    },
    true
  )
}

export function factory() {
  Graph.registerVueComponent(
    'factory',
    {
      // eslint-disable-next-line quotes
      template: `<Factory />`,
      components: {
        Factory
      }
    },
    true
  )
}
