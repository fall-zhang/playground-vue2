<template>
  <!-- 用户可进行的操作：单机，双击，鼠标滚轮 -->
  <!-- 图形类型：边，节点，节点上的port -->
  <!-- 删除功能：点击图像后，左上角展示一个按钮，添加 -->
  <!-- 双击：弹出确认框，提供选择（不再弹出） -->
  <!-- 点击图像后，展示图像的功能然后删除点击图像后，左上角展示一个按钮，添加 -->
  <!-- 添加图例功能，帮助用户使用 -->
  <!-- 配置滚轮缩放还是，ctrl 缩放 -->
  <!-- 配置直接可以拖动，还是长按空格可拖动 -->
  <div>
    <div class="tool-bar">
      <!-- <button type="primary" @click="onAddNode">添加单个图形</button> -->
      <button @click="onTogglePort">
        连接功能<input v-model="setting.showPort" type="checkbox" />
      </button>
      <!-- 当鼠标按下一个 port 时触发 -->
      <!-- <button @click="onTogglePort">
        智能链接<input v-model="setting.showPort" type="checkbox" />
      </button> -->
      <button @click="onToggleDrag">
        移动画布<input v-model="setting.dragGraph" type="checkbox" />
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
        <div>选中节点：{{ JSON.stringify(selectCell.node) }}</div>
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
import { getBasicRect } from './shape/basicGraph.js'
import { getSpecialCircle } from './shape/specialGraph.js'
// import moment from 'dayjs'
import graphData from './graphData'
import { rect } from '@antv/x6/lib/registry/connection-point/rect'
export default {
  name: 'AntVGraph',
  props: {},
  data() {
    return {
      graph: null,
      setting: {
        showPort: true, // 显示连接
        dragGraph: true, // 移动画布
        showGrid: false
      },
      selectCell: {
        id: '',
        cell: null,
        node: null,
        mouseOverCell: null
      }
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
          cellId: '',
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
        // const pos = node.position()
        // graph.select(node)
        this.selectCell.node = node
        // console.log(node)
        // console.log(node.hasPorts())
        // this.nodeStatus.x = pos.x
        // this.nodeStatus.y = pos.y
      })
      graph.on('edge:mouseenter', ({ edge }) => {
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
      const nodeSize = {
        width: 60,
        height: 60
      }
      const shape1 = getSpecialCircle('名字', {
        x: x + nodeSize.width + 50,
        y: y + nodeSize.height + 50
      })
      const node2 = this.graph.addNode(shape1)
      this.connectRect(node, node2)
    },
    // 链接两个 rect
    connectRect(rect1, rect2) {
      const { graph } = this
      const allEdges = graph.getEdges()
      let rect1Ports = {}
      // let rect2Ports = {}
      rect1.getPorts().forEach((port) => {
        if (rect1Ports[port.id]) {
          rect1Ports[port.id].push(port.group)
        } else {
          rect1Ports[port.id] = port.group
        }
      })
      // rect2.getPorts().forEach((port) => {
      //   if (rect2Ports[port.group]) {
      //     rect2Ports[port.group].push(port.id)
      //   } else {
      //     rect2Ports[port.group] = [port.id]
      //   }
      // })
      let connectMap = {
        'top-1': { relative: 'left-1', target: 'right-4', x: -200, y: -200 },
        'top-2': { relative: 'top-3', target: 'boottom-2', x: 200, y: 200 },
        'top-3': { relative: 'top-2', target: 'bottom-3', x: 200, y: 200 },
        'top-4': { relative: 'right-1', target: 'left-1', x: 200, y: 200 },
        'right-1': { relative: 'top-4', target: 'bottom-1', x: 200, y: 200 },
        'right-2': { relative: 'right-3', target: 'left-2', x: 200, y: 200 },
        'right-3': { relative: 'right-2', target: 'left-3', x: 200, y: 200 },
        'right-4': { relative: 'bottom-4', target: 'top-1', x: 200, y: 200 },
        'bottom-1': { relative: 'left-4', target: 'right-1', x: 200, y: 200 },
        'bottom-2': { relative: 'bottom-3', target: 'top-2', x: 200, y: 200 },
        'bottom-3': { relative: 'bottom-2', target: 'top-3', x: 200, y: 200 },
        'bottom-4': { relative: 'right-4', target: 'left-1', x: 200, y: 200 },
        'left-1': { relative: 'top-1', target: 'bottom-4', x: -200, y: -200 },
        'left-2': { relative: 'left-3', target: 'right-2', x: 200, y: 200 },
        'left-3': { relative: 'left-2', target: 'right-3', x: 200, y: 200 },
        'left-4': { relative: 'bottom-1', target: 'right-1', x: 200, y: 200 }
      }
      allEdges.forEach((edge) => {
        const target = edge.getTarget()
        const source = edge.getSource()
        if (target.cell == rect1.id && rect1Ports[target.port]) {
          let relativePorts = connectMap[target.port].relative
          delete rect1Ports[target.port]
          delete rect1Ports[relativePorts]
        }
        if (source.cell == rect1.id && rect1Ports[source.port]) {
          let relativePorts = connectMap[source.port].relative
          delete rect1Ports[source.port]
          delete rect1Ports[relativePorts]
        }
      })
      console.log('剩余未使用节点', rect1Ports)
      let connectPortSource = Object.keys(rect1Ports).find((item) => item)
      console.log(connectPortSource)
      if (!connectPortSource) {
        console.log('没有额外节点提供连接')
        return
      }
      let connectTarget = connectMap[connectPortSource].target
      let { x: locateX, y: locateY } = rect2.position()
      rect2.position(locateX, locateY)
      graph.addEdge({
        shape: 'edge', // 指定使用何种图形，默认值为 'edge'
        source: { cell: rect1, port: connectPortSource },
        target: { cell: rect2, port: connectTarget.target }
      })
      // 对两个 rect 进行连接默认上、右、下、左，如果都已经有内容，则，右上，右下，左下，左上
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
