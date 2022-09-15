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
export default {
  // 节点
  nodes: [
    {
      id: 'node1', // String，可选，节点的唯一标识
      x: 40, // Number，必选，节点位置的 x 值
      y: 40, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: 'hello', // String，节点标签
      data: {
        box: 'dffd',
        ager: 'anger'
      }
    },
    {
      id: 'node2', // String，节点的唯一标识
      x: 160, // Number，必选，节点位置的 x 值
      y: 180, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: 'world', // String，节点标签
      ports: [
        { id: 'port1', attrs: { circle: { r: 6 } } },
        { id: 'port2' },
        { id: 'port3' }
      ]
    },
    {
      id: 'node3', // String，节点的唯一标识
      x: 500, // Number，必选，节点位置的 x 值
      y: 500, // Number，必选，节点位置的 y 值
      shape: 'circle',
      width: 80, // Number，可选，节点大小的 width 值
      height: 80, // Number，可选，节点大小的 height 值
      label: '我我我我', // String，节点标签
      ports: {
        groups: {
          top: {
            attrs: portConifg.attrs,
            position: {
              name: 'top',
              args: {}
            }
          },
          right: {
            attrs: portConifg.attrs,
            position: {
              name: 'right',
              args: {}
            }
          },
          bottom: {
            attrs: portConifg.attrs,
            position: {
              name: 'bottom',
              args: {}
            }
          },
          left: {
            attrs: portConifg.attrs,
            position: {
              name: 'left',
              args: {}
            }
          }
        },
        items: [
          { id: 'top-1', group: 'top' },
          { id: 'top-2', group: 'top' },
          { id: 'top-3', group: 'top' },
          { id: 'top-4', group: 'top' },
          { id: 'right-1', group: 'right' },
          { id: 'right-2', group: 'right' },
          { id: 'right-3', group: 'right' },
          { id: 'right-4', group: 'right' },
          { id: 'bottom-1', group: 'bottom' },
          { id: 'bottom-2', group: 'bottom' },
          { id: 'bottom-3', group: 'bottom' },
          { id: 'bottom-4', group: 'bottom' },
          { id: 'left-1', group: 'left' },
          { id: 'left-2', group: 'left' },
          { id: 'left-3', group: 'left' },
          { id: 'left-4', group: 'left' }
        ]
      }
    }
  ],
  // 边
  edges: [
    {
      source: 'node1', // String，必须，起始节点 id
      target: 'node2' // String，必须，目标节点 id
    }
  ]
}
