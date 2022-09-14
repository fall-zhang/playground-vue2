<template>
  <!-- 用户可进行的操作：单机，双击，鼠标滚轮 -->
  <!-- 图形类型：边，节点，节点上的port -->
  <!-- 删除功能：点击图像后，左上角展示一个按钮，添加 -->
  <!-- 双击：弹出确认框，提供选择（不再弹出） -->
  <!-- 点击图像后，展示图像的功能然后删除点击图像后，左上角展示一个按钮，添加 -->
  <!-- 添加图例功能，帮助用户使用 -->
  <!-- 配置滚轮缩放还是，ctrl 缩放 -->
  <!-- 配置直接可以拖动，还是长按空格可拖动 -->
  <!-- 点击连接节点时，显示1/2/3 作为先后点击的内容 -->
  <div>
    <div class="tool-bar">
      <!-- 来大佬大佬大佬大佬 {{ JSON.stringify(baorr.gogo) }} -->
      <!-- <button type="primary" @click="onAddNode">添加单个图形</button> -->
      <button @click="onTogglePort">
        连接功能<input v-model="setting.showPort" type="checkbox" />
      </button>
      <!-- 当鼠标按下一个 port 时触发 -->
      <button @click="onToggleDrag">
        移动画布<input v-model="setting.dragGraph" type="checkbox" />
      </button>
      <button @click="onSmartConnect">
        智能连接<input v-model="setting.smartConnect" type="checkbox" />
      </button>
      <button @click="onToggleGrid">
        显示网格<input v-model="setting.showGrid" type="checkbox" />
      </button>
    </div>
    <div class="graph-container" :class="setting.showPort ? '' : 'hidePort'">
      <div ref="antVAdder" class="graph-adder"></div>
      <div ref="antVContainer" class="graph-editor"></div>
      <div ref="antVAdder2" class="graph-adder">
        <button @click="onAddCellRelationship(selectCell.node)">
          添加节点
        </button>
        <button @click="onConnectRelativeRect()">连接节点</button>
        <div style="overflow: scroll; height: 80%">
          选中节点：{{ JSON.stringify(selectCell.node) }}
        </div>
        <div>
          <button>保存</button>
          <button>取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Graph, DataUri, Addon } from '@antv/x6'
// import { getBasicRect } from './shape/basicGraph.js'
import { getSpecialCircle } from './shape/specialGraph.js'
// import moment from 'dayjs'
import graphData from './graphData'
// import { rect } from '@antv/x6/lib/registry/connection-point/rect'

export default {
  name: 'AntVGraph',
  props: {},
  emits: ['selectCell'],
  data() {
    return {
      graph: null,
      setting: {
        showPort: true, // 显示连接
        dragGraph: true, // 移动画布
        showGrid: false, // 展示网格
        smartConnect: false // 智能连接
      },
      selectCell: {
        id: '',
        cell: null,
        cellId: '',
        node: null,
        mouseOverCell: null
      },
      allEdges: []
    }
  },
  mounted() {
    // 图形编辑区域
    this.initGraphZone()
    this.initGraphAdder()
    this.registerEvents()
  },
  methods: {
    initGraphZone() {
      this.graph = new Graph({
        container: this.$refs['antVContainer'],
        panning: true,
        mousewheel: {
          enabled: true,
          modifiers: []
        },
        connecting: {
          snap: true
        },
        selecting: {
          enabled: false,
          showNodeSelectionBox: true,
          multiple: false
        }
      })
      this.graph.fromJSON(graphData)
    },
    initGraphAdder() {
      const { graph } = this
      //  创建对象
      const stencil = new Addon.Stencil({
        search: false,
        // collapsable: true,
        target: graph,
        stencilGraphWidth: 200,
        stencilGraphHeight: 800,
        groups: [
          {
            name: 'basicShape',
            title: '基本组件',
            graphWidth: 200,
            graphHeight: 300
          },
          {
            name: 'specialShape',
            title: '特定组件',
            graphWidth: 200,
            graphHeight: 300
          }
        ]
      })
      // const r1 = getBasicRect()
      const circle = getSpecialCircle()
      stencil.load([circle], 'specialShape')
      // stencil
      this.$refs['antVAdder'].appendChild(stencil.container)
    },
    registerEvents() {
      const { graph } = this
      graph.on('cell:selected', (args) => {
        this.selectCell.cellId = args.cell.id
      })
      graph.on('cell:click', ({ cell }) => {
        graph.select(cell)
        this.selectCell.cell = cell
      })
      graph.on('node:mouseenter', ({ node }) => {
        this.selectCell.mouseOverCell = node
        this.showPort(node, true)
      })
      graph.on('node:mouseleave', ({ node }) => {
        this.selectCell.mouseOverCell = null
      })
      graph.on('node:click', ({ node }) => {
        this.selectCell.node = node
      })
      graph.on('edge:mouseenter', ({ edge }) => {
        console.log(edge.getSource())
        edge.addTools([
          // { name: 'segments' },
          // { name: 'source-arrowhead' },
          // { name: 'target-arrowhead' }
        ])
        if (this.isLineEdit) {
          edge.addTools([{ name: 'vertices' }])
        }
      })
      graph.on('edge:mouseleave', ({ edge }) => {
        edge.removeTools()
      })
      this.graph.on('edge:mouseup', ({ edge }) => {
        // console.log(edge)
        const degeInfo = edge.store.data
        if (degeInfo.source.cell === degeInfo.target.cell) {
          this.graph.removeNode(edge)
        }
      })
      graph.on('edge:dblclick', ({ edge }) => {
        graph.removeNode(edge)
      })
      graph.on('blank:click', () => {
        // this.controlType = 'graph'
      })
      graph.on('selection:changed', (args) => {
        args.added.forEach((cell) => {
          this.selectCell.cell = cell
          if (cell.isEdge() && this.isLineEdit) {
            return
          }
          if (
            cell.getData() === undefined ||
            cell.getData().name === undefined
          ) {
            cell.setData({
              name: ''
            })
          }
          if (cell.isNode()) {
            const pos = cell.position()
            const size = cell.size()
            this.nodeStatus = {
              x: Number(pos.x),
              y: Number(pos.y),
              width: Number(size.width),
              height: Number(size.height)
            }
          } else {
            this.verticesTable = cell.getVertices()
          }
        })
      })
    },
    onSmartConnect() {
      const { setting, graph } = this
      if (setting.smartConnect) {
        this.setting.smartConnect = false
        graph.disableMultipleSelection()
      } else {
        this.setting.smartConnect = true
        graph.enableMultipleSelection()
      }
    },
    onDownload() {
      this.graph.toPNG(
        (dataUri) => {
          // 下载
          DataUri.downloadDataUri(dataUri, 'chart.png')
        },
        {
          padding: {
            top: 20,
            right: 30,
            bottom: 40,
            left: 50
          }
        }
      )
    },
    onTogglePort() {
      if (this.setting.showPort) {
        this.setting.showPort = false
      } else {
        this.setting.showPort = true
      }
    },
    onToggleDrag() {
      const { graph } = this
      if (this.setting.dragGraph) {
        this.setting.dragGraph = false
        graph.disablePanning()
        graph.enableSelection()
        graph.enableRubberband()
      } else {
        this.setting.dragGraph = true
        graph.enablePanning()
        graph.disableRubberband()
        graph.disableSelection()
      }
    },
    onToggleGrid() {
      const { graph } = this
      console.log(this.setting.showGrid)
      if (this.setting.showGrid) {
        this.setting.showGrid = false
        graph.hideGrid()
      } else {
        this.setting.showGrid = true
        graph.showGrid()
      }
    },
    onAddCellRelationship(node) {
      const { x, y } = node.position()
      const shape1 = getSpecialCircle('名字', {
        x: x,
        y: y
      })
      const node2 = this.graph.addNode(shape1)
      this.connectRect(node, node2)
    },
    // 重新移动链接两个 rect
    connectRect(rect1, rect2) {
      const { graph } = this
      let rect1Ports = {}
      // let rect2Ports = {}
      let connectMap = {
        'top-1': { relative: 'left-4', target: 'right-4', x: -200, y: -200 },
        'top-2': { relative: 'top-3', target: 'bottom-3', x: 0, y: -200 },
        'top-3': { relative: 'top-2', target: 'bottom-2', x: 0, y: -200 },
        'top-4': { relative: 'right-1', target: 'left-1', x: 200, y: -200 },
        'right-1': { relative: 'top-4', target: 'bottom-4', x: 200, y: -200 },
        'right-2': { relative: 'right-3', target: 'left-3', x: 200, y: 0 },
        'right-3': { relative: 'right-2', target: 'left-2', x: 200, y: 0 },
        'right-4': { relative: 'bottom-1', target: 'top-1', x: 200, y: 200 },
        'bottom-1': { relative: 'right-4', target: 'left-4', x: 200, y: 200 },
        'bottom-2': { relative: 'bottom-3', target: 'top-3', x: 0, y: 200 },
        'bottom-3': { relative: 'bottom-2', target: 'top-2', x: 0, y: 200 },
        'bottom-4': { relative: 'left-1', target: 'right-1', x: -200, y: 200 },
        'left-1': { relative: 'bottom-4', target: 'top-4', x: -200, y: 200 },
        'left-2': { relative: 'left-3', target: 'right-3', x: -200, y: 0 },
        'left-3': { relative: 'left-2', target: 'right-2', x: -200, y: 0 },
        'left-4': { relative: 'bottom-1', target: 'right-1', x: -200, y: -200 }
      }
      const { x: rect1X, y: rect1Y } = rect1.position()
      // const result = graph.findViewsInArea(rect1X, rect1Y)
      Object.keys(connectMap).forEach((port) => {
        rect1Ports[port] = true
      })
      Object.entries(connectMap).find(([key, value]) => {
        const result = graph.findViewsInArea(
          rect1X + value.x,
          rect1Y + value.y,
          60,
          60
        )
        if (result.length > 0) {
          delete rect1Ports[key]
        }
      })
      // const allEdges = graph.getEdges()
      // allEdges.forEach((edge) => {
      //   const target = edge.getTarget()
      //   const source = edge.getSource()
      //   if (target.cell == rect1.id && rect1Ports[target.port]) {
      //     let relativePorts = connectMap[target.port].relative
      //     delete rect1Ports[target.port]
      //     delete rect1Ports[relativePorts]
      //   }
      //   if (source.cell == rect1.id && rect1Ports[source.port]) {
      //     let relativePorts = connectMap[source.port].relative
      //     delete rect1Ports[source.port]
      //     delete rect1Ports[relativePorts]
      //   }
      // })
      // console.log('剩余未使用节点', rect1Ports)
      let connectPortSource = Object.keys(rect1Ports).find((item) => item)
      if (!connectPortSource) {
        console.error('没有额外节点提供连接')
        graph.removeNode(rect2)
        return
      }
      let connectTarget = connectMap[connectPortSource]
      // console.log(connectPortSource)
      // console.log(connectTarget)
      // console.log(rect2.position())
      let { x: locateX, y: locateY } = rect2.position()
      rect2.position(locateX + connectTarget.x, locateY + connectTarget.y)
      // console.log(locateX + connectTarget.x)
      // console.log(rect2.position())
      graph.addEdge({
        shape: 'edge', // 指定使用何种图形，默认值为 'edge'
        source: { cell: rect1, port: connectPortSource },
        target: { cell: rect2, port: connectTarget.target }
      })
      // 对两个 rect 进行连接默认上、右、下、左，如果都已经有内容，则，右上，右下，左下，左上
    },
    onConnectRelativeRect() {
      const { graph } = this
      // console.log(graph.getSelectedCells())
      const selectNodes = graph.getSelectedCells().filter((item) => {
        if (item.isNode()) {
          return true
        }
      })
      // console.log(selectNodes)
      for (let i = 0; i < selectNodes.length; i++) {
        console.log('执行了', i)
        if (i + 1 === selectNodes.length) {
          this.addConnect(selectNodes.at(i), selectNodes.at(0))
        } else {
          this.addConnect(selectNodes[i], selectNodes[i + 1])
        }
      }
      const update = (edge) => {
        const edgeView = graph.findViewByCell(edge)
        console.log('update')
        edgeView.update()
      }
      selectNodes.forEach((edge) => {
        edge.on('change:position', update(edge))
      })
    },
    addConnect(rect1, rect2) {
      const { graph } = this
      let rect1Ports = {
        left: 'left-3',
        top: 'top-3',
        bottom: 'bottom-2',
        right: 'right-3',
        'right-top': 'top-4',
        'left-top': 'top-1',
        'right-bottom': 'bottom-1',
        'left-bottom': 'left-1'
      }
      let connectMap = {
        'top-1': { relative: 'left-4', target: 'right-4', x: -200, y: -200 },
        'top-2': { relative: 'top-3', target: 'bottom-3', x: 0, y: -200 },
        'top-3': { relative: 'top-2', target: 'bottom-2', x: 0, y: -200 },
        'top-4': { relative: 'right-1', target: 'left-1', x: 200, y: -200 },
        'right-1': { relative: 'top-4', target: 'bottom-4', x: 200, y: -200 },
        'right-2': { relative: 'right-3', target: 'left-3', x: 200, y: 0 },
        'right-3': { relative: 'right-2', target: 'left-2', x: 200, y: 0 },
        'right-4': { relative: 'bottom-1', target: 'top-1', x: 200, y: 200 },
        'bottom-1': { relative: 'right-4', target: 'left-4', x: 200, y: 200 },
        'bottom-2': { relative: 'bottom-3', target: 'top-3', x: 0, y: 200 },
        'bottom-3': { relative: 'bottom-2', target: 'top-2', x: 0, y: 200 },
        'bottom-4': { relative: 'left-1', target: 'right-1', x: -200, y: 200 },
        'left-1': { relative: 'bottom-4', target: 'top-4', x: -200, y: 200 },
        'left-2': { relative: 'left-3', target: 'right-3', x: -200, y: 0 },
        'left-3': { relative: 'left-2', target: 'right-2', x: -200, y: 0 },
        'left-4': { relative: 'bottom-1', target: 'right-1', x: -200, y: -200 }
      }
      // 得出节点二在节点一的哪个位置，然后根据位置，选择对应的节点进行添加
      const { x: rect1X, y: rect1Y } = rect1.position()
      const { x: rect2X, y: rect2Y } = rect2.position()
      let position = []
      // rect1 在 rect2 的哪个方向
      if (rect1X - rect2X > 30) {
        position.push('left')
      } else if (rect1X - rect2X < -30) {
        position.push('right')
      }
      if (rect1Y - rect2Y > 30) {
        position.push('top')
      } else if (rect1Y - rect2Y < -30) {
        position.push('bottom')
      }
      position = position.join('-')
      console.log(position)
      let connectPortSource = rect1Ports[position]
      if (!connectPortSource) {
        console.error('没有额外节点提供连接')
        return
      }
      let connectTarget = connectMap[connectPortSource]
      graph.addEdge({
        shape: 'edge', // 指定使用何种图形，默认值为 'edge'
        source: { cell: rect1, port: connectPortSource },
        target: { cell: rect2, port: connectTarget.target },
        router: {
          name: 'manhattan',
          args: {
            startDirections: position.split('-'),
            endDirections: position.split('-')
          }
        }
      })
    },
    showPort() {
      // 显示当前 Port
    }
  }
}
</script>

<style scoped lang="scss">
.tool-bar {
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    height: 28px;
    font-size: 16px;
    font-weight: 540;
    // width: ;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    margin: 0 12px;
  }
}

.graph-container {
  border: 1px solid #ccc;
  border-radius: 6px;
  height: 800px;
  width: calc(100% - 40px);
  overflow: hidden;
  display: flex;
  // justify-content: flex-start;
  margin: 20px;

  .graph-adder {
    height: 800px;
    position: relative;
    width: 200px;
    background-color: pink;
  }

  .graph-editor {
    flex-grow: 1;
  }
}

.hidePort {
  :deep(.x6-port) {
    display: none;
  }
}
</style>
