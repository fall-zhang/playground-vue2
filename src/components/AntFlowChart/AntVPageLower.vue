<template>
  <!-- 用户可进行的操作：单机，双击，鼠标滚轮 -->
  <!-- 图形类型：边，节点，节点上的port -->
  <!-- 删除功能：点击图像后，左上角展示一个按钮，添加 -->
  <!-- 双击：弹出确认框，提供选择（不再弹出） -->
  <!-- 点击图像后，展示图像的功能然后删除点击图像后，左上角展示一个按钮，添加 -->
  <!-- 添加图例功能，帮助用户使用 -->
  <!-- 配置滚轮缩放还是，ctrl 缩放 -->
  <!-- 配置直接可以拖动，还是长按空格可拖动 -->
  <!-- 点击连接节点时，显示 1/2/3 作为先后点击的内容 -->
  <div>
    <div class="tool-bar">
      <div style="margin-right: 10px;">
        <el-button size="medium" type="primary" @click="onSaveChart">保存</el-button>
        <el-button size="medium"  type="primary">导入</el-button>
        <el-button size="medium"  type="primary" @click="onExoprt">导出</el-button>
        <el-button size="medium" type="primary">撤销</el-button>
        <el-button size="medium" type="primary">重做</el-button>
        <el-button size="medium" type="primary" @click="updateGraph">更新排列</el-button>
        <el-button size="medium" type="primary" @click="updateEdge">连接节点</el-button>
      </div>
      <div style="border-left:1px solid #aaa;padding-left: 10px;">
        <el-checkbox v-model="setting.showPort" @change="onTogglePort">连接功能</el-checkbox>
        <el-checkbox v-model="setting.dragGraph" @change="onToggleDrag">移动画布</el-checkbox>
        <el-checkbox v-model="setting.smartConnect" @change="onSmartConnect">智能连接</el-checkbox>
        <el-checkbox v-model="setting.showGrid" @change="onToggleGrid">显示网格</el-checkbox>
        <el-checkbox v-model="setting.canZoom" @change="onToggleZoom">缩放功能</el-checkbox>
      </div>
    </div>
    <div class="graph-container" :class="setting.showPort ? '' : 'hidePort'">
      <div ref="antVAdder" class="graph-adder"></div>
      <div ref="antVContainer" class="graph-editor"></div>
      <div ref="antVAdder2" class="graph-adder">
        <div>
          <button @click="onAddCellRelationship()">
            添加节点
          </button>
          <button @click="onConnectRelativeRect">连接节点</button>
        </div>
        <div style="height: 80%">
          <div style="height:50%;overflow:scroll">
            {{JSON.stringify(selectCell.value)}}
          </div>
          <el-form ref="form"  label-width="60px">
            <el-form-item label="ID">
              <el-input size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="onSaveCellInfo">保存</el-button>
              <el-button size="small">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Graph, DataUri, Addon } from '@antv/x6'
import graphData from './mapLocation.json'
// 注册并引入特殊组件内容
import { createCircle } from './shape/basicGraph.js'
import { getStationCircle,CircleBlueWord,GreenWord,Breaker } from './shape/specialGraph.js'
import { defineGroup }from '@/utils/rank.js'
import { chartSize }from './utils.js'
// import './shape/registerComponents.js'
// 引入自定义组件文件
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
        smartConnect: false, // 智能连接
        canZoom:true, // 能否缩放
        deleteEdgeConfirm: true
      },
      selectCell: {
        type: '',
        value: null
      },
      allEdges: []
    }
  },
  mounted() {
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
      // this.graph.fromJSON(graphData)
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
            graphHeight: 300,
            collapsed:true
          },
          {
            name: 'specialShape',
            title: '特定组件',
            graphWidth: 200,
            graphHeight: 300,
            collapsed:true
          },
          {
            name:'oldShape',
            title:'旧式组件'
          }
        ]
      })
      const circle = getStationCircle()
      const basicShape = [
        createCircle('#407aee'), // 蓝
        createCircle('#73f26f'), // 绿
        createCircle('#e8694b'), // 红
        createCircle('#f3d854'), // 黄
        createCircle('#5d5c57') // 黑
      ]
      stencil.load(basicShape, 'basicShape')
      stencil.load([circle], 'specialShape')
      const specialShape = [
        new CircleBlueWord(),
        new GreenWord(),
        new Breaker()
      ]
      stencil.load(specialShape, 'oldShape')
      // stencil
      this.$refs['antVAdder'].appendChild(stencil.container)
    },
    registerEvents() {
      const { graph } = this
      graph.on('cell:selected', () => {
        // this.selectCell.value = cell
        // this.selectCell.type = 'cell'
      })
      graph.on('cell:click', ({ cell }) => {
        graph.select(cell)
        this.selectCell.cell = cell
      })
      graph.on('node:mouseenter', ({ node }) => {
        this.selectCell.mouseOverCell = node
      })
      graph.on('node:mouseleave', () => {
        this.selectCell.mouseOverCell = null
      })
      graph.on('node:click', ({ node }) => {
        // this.selectCell.node = node
        this.selectCell.value = node
        this.selectCell.type = 'node'
      })
      graph.on('edge:mouseenter', ({ edge }) => {
        console.log(edge)
        edge.addTools([
          { name: 'segments' },
          { name: 'button' },
          { name: 'source-arrowhead' },
          { name: 'target-arrowhead' }
          // { name: 'vertices' }  // 添加电厂站节点
        ])
        edge.appendLabel({
          attrs: {
            label: { text: '电厂站' },
            rect:{
              event:'edge:click',
              fill:'#2fc'
            }
          },
          position:{
            // distance:0.66,
            // angle: 180,
            options: {
              keepGradient: true,
              ensureLegibility:true
            },
            offset:-20
          }
        })
      })
      // graph.on('edge:customevent',({ name,view,e }) => {
      //   if(name === 'edge:click') {
      //     console.log('dfdfdf')
      //   }
      // })
      // graph.on('edge:click',({ name,view,e }) => {
      //   console.log(view)
      // })
      graph.on('edge:mouseleave', ({ edge }) => {
        edge.removeTools()
      })
      graph.on('edge:mouseup', ({ edge }) => {
        // console.log(edge)
        const degeInfo = edge.store.data
        if (degeInfo.source.cell === degeInfo.target.cell) {
          graph.removeNode(edge)
        }
      })
      graph.on('edge:click', ({ edge }) => {
        console.log(edge)
      })
      graph.on('edge:dblclick', ({ edge }) => {
        graph.removeNode(edge)
      })
      graph.on('blank:click', () => {
        this.selectCell = {
          type:'',
          value:null
        }
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
    updateGraph() {
      const { graph } = this
      // 筛选 rect
      const rects = graphData.subData
      // 计算图像的大小，比如 5 * 5 的节点
      const size = chartSize(rects.length)
      let widthSize = Math.max(...size)
      let heightSize = Math.min(...size)
      // 根据维度排序
      const arr1 = rects.sort((left,right) => {
        if(Number(left.geometry.coordinates[1]) > right.geometry.coordinates[1]) {
          return -1
        }
        return 1
      })
      const group = defineGroup(arr1,widthSize)
      for(let i = 0;i < group.length;i++) {
        group[i].sort((left,right) => {
          if(Number(left.geometry.coordinates[0]) > right.geometry.coordinates[0]) {
            return 1
          }
          return -1
        })
      }
      for(let i = 0;i < group.length;i++) {
        for(let j = 0;j < heightSize;j++) {
          let position = {
            x:j * 200 + 40,
            y:i * 200 + 40
          }
          if(j % 2) { // 一行中，偶数个变电站会向下移动
            position.y += 100
          }
          if(group[i][j]) {
            const rect = group[i][j]
            const info = {
              id:rect.properties.stid,
              name: rect?.properties?.name
            }
            const node = getStationCircle(info.name,{
              id:info.id,
              x:position.x,
              y:position.y
            })
            graph.addNode(node)
          }
        }
      }
    },
    updateEdge() {
      const { graph } = this
      const selectEdges = graphData.lineData
      selectEdges.forEach(edge => {
        const rect1 = graph.getCellById(edge.properties.nodeFrom)
        const rect2 = graph.getCellById(edge.properties.nodeTo)
        this.addConnect(rect1,rect2)
      })
    },
    onSmartConnect() {
      const { setting, graph } = this
      if (setting.smartConnect) {
        graph.enableMultipleSelection()
      } else {
        graph.disableMultipleSelection()
      }
    },
    onToggleZoom() {
      const { graph } = this
      if(this.setting.canZoom) {
        graph.enableMouseWheel()
      }else{
        graph.disableMouseWheel()
      }
      console.log(this.graph.toJSON())
    },
    onExoprt() {
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
    },
    onToggleDrag() {
      // console.log(this.setting.dragGraph)
      // console.log(value)
      const { graph } = this
      if (this.setting.dragGraph) {
        graph.enablePanning()
        graph.disableRubberband()
        graph.disableSelection()
      } else {
        graph.disablePanning()
        graph.enableSelection()
        graph.enableRubberband()
      }
    },
    onToggleGrid() {
      const { graph } = this
      // console.log(this.setting.showGrid)
      if (this.setting.showGrid) {
        graph.showGrid()
      } else {
        graph.hideGrid()
      }
    },
    onSaveChart() {
      console.log(this.graph.toJSON())
    },
    onAddCellRelationship() {
      let node = null
      if(this.selectCell.type !== 'node') {
        return
      }
      node = this.selectCell.value
      const { x, y } = node.position()
      const shape1 = getStationCircle('名字', {
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
      let connectPortSource = Object.keys(rect1Ports).find((item) => item)
      if (!connectPortSource) {
        console.error('没有额外节点提供连接')
        graph.removeNode(rect2)
        return
      }
      let connectTarget = connectMap[connectPortSource]
      let { x: locateX, y: locateY } = rect2.position()
      rect2.position(locateX + connectTarget.x, locateY + connectTarget.y)
      graph.addEdge({
        shape: 'edge', // 指定使用何种图形，默认值为 'edge'
        source: { cell: rect1, port: connectPortSource },
        target: { cell: rect2, port: connectTarget.target }
      })
      // 对两个 rect 进行连接默认上、右、下、左，如果都已经有内容，则，右上，右下，左下，左上
    },
    onConnectRelativeRect() {
      const { graph } = this
      const selectNodes = graph.getSelectedCells().filter((item) => {
        if (item.isNode()) {
          return true
        }
      })
      // console.log(selectNodes)
      for (let i = 0; i < selectNodes.length; i++) {
        // console.log('执行了', i)
        if (i + 1 === selectNodes.length) {
          this.addConnect(selectNodes.at(i), selectNodes.at(0))
        } else {
          this.addConnect(selectNodes[i], selectNodes[i + 1])
        }
      }
      const update = (edge) => {
        const edgeView = graph.findViewByCell(edge)
        // console.log('update')
        edgeView.update()
      }
      selectNodes.forEach((edge) => {
        edge.on('change:position', update(edge))
      })
    },
    addConnect(rect1, rect2) {
      const { graph } = this
      let rectPorts = {
        left: ['left-2','left-3','left-1','left-4'], // 根据排序，依次连接
        top: ['top-2','top-3','top-1','top4'],
        bottom: ['bottom-3','bottom-2','bottom-1','bottom-4'],
        right: ['right-3','right-2','right-1','right-4'],
        'right-top': ['top-4','right-1','top-3','right-2'],
        'left-top': ['top-1','left-4','top-2','bottom-3'],
        'right-bottom': ['right-4','bottom-1','bottom-2','right-3'],
        'left-bottom': ['left-1','bottom-4','bottom-3','left-2']
      }
      let rect1CanConnectMap = {}
      let rect2CanConnectMap = {};
      ['top','right','bottom','left'].forEach(item => {
        for(let i = 1;i <= 4;i++) {
          rect1CanConnectMap[item + '-' + i] = true
          rect2CanConnectMap[item + '-' + i] = true
        }
      })
      const allEdges = graph.getEdges()
      // 删除所有相关的节点
      allEdges.forEach((edge) => {
        const edgeTarget = edge.getTarget()
        const edgeSource = edge.getSource()
        if(edgeTarget.cell == rect1.id) {
          rect1CanConnectMap[edgeTarget.port] = false
        }else if(edgeSource.cell === rect1.id) {
          rect1CanConnectMap[edgeSource.port] = false
        }
        if(edgeTarget.cell == rect2.id) {
          rect2CanConnectMap[edgeTarget.port] = false
        }else if(edgeSource.cell === rect2.id) {
          rect2CanConnectMap[edgeSource.port] = false
        }
      })
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
      let rectPort1 = rectPorts[position].find(item => rect1CanConnectMap[item])
      const port2Direction = this.reverseDirection(position)
      let rectPort2 = rectPorts[port2Direction].find(item => rect2CanConnectMap[item])
      if(rect2.label === '富城变') {
        console.log(rectPort1,rectPort2)
      }
      graph.addEdge({
        shape: 'edge', // 指定使用何种图形，默认值为 'edge'
        source: { cell: rect1, port: rectPort1 },
        target: { cell: rect2, port: rectPort2 }
      })
    },
    onSaveCellInfo() {
    },
    reverseDirection(direction) {
      const directionArr = direction.split('-')
      if(typeof direction === 'string' && directionArr.length < 2) {
        return getDirect(direction)
      }
      return getDirect(directionArr[0]) + '-' + getDirect(directionArr[1])
      function getDirect(direct) {
        if(direct === 'left') {
          return 'right'
        }else if(direct === 'right') {
          return 'left'
        }else if(direct === 'top') {
          return 'bottom'
        }
        return 'top'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@keyframes ant-line {
  to {
    stroke-dashoffset: -1000;
  }
}
.tool-bar {
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

}

.graph-container {
  border: 1px solid #ccc;
  border-radius: 6px;
  height: 90vh;
  width: calc(100% - 40px);
  overflow: hidden;
  display: flex;
  // justify-content: flex-start;
  margin: 20px;

  .graph-adder {
    height: 90vh;
    position: relative;
    width: 260px;
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
