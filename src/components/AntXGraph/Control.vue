<template>
  <div id="control">
    <div v-if="controlType === 'graph'">
      <div class="title">设置画布</div>
      <div class="body">
        <el-form ref="graphForm" :model="graphForm" label-width="80px">
          <el-form-item label="背景颜色">
            <el-color-picker
              v-model="graphForm.color"
              show-alpha
              @change="changeBgColor"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="显示网格">
            <el-switch v-model="graphForm.showGrid" @change="showGrid">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="controlType === 'node'">
      <div class="title">设置节点</div>
      <div class="body">
        <el-form ref="nodeForm" :model="nodeForm" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="nodeForm.id" @change="changeNodeId"></el-input>
          </el-form-item>
          <el-form-item label="名字">
            <el-input
              v-model="nodeForm.name"
              @change="changeNodeName"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="text" @click="openChoose">选择数据</el-button>
          </el-form-item>
          <el-form-item label="x">
            <el-input v-model="nodeForm.x" @change="changeNodeX"></el-input>
          </el-form-item>
          <el-form-item label="y">
            <el-input v-model="nodeForm.y" @change="changeNodeY"></el-input>
          </el-form-item>
          <el-form-item label="宽">
            <el-input
              v-model="nodeForm.width"
              @change="changeNodeWidth"
            ></el-input>
          </el-form-item>
          <el-form-item label="高">
            <el-input
              v-model="nodeForm.height"
              @change="changeNodeHeight"
            ></el-input>
          </el-form-item>
          <el-form-item label="旋转角度">
            <el-input
              v-model="nodeForm.angle"
              @change="changeNodeAngle"
            ></el-input>
          </el-form-item>
          <el-form-item label="填充颜色">
            <el-color-picker
              v-model="nodeForm.color"
              show-alpha
              @change="changeNodeColor"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="边框宽度">
            <el-input
              v-model="nodeForm.strokeWidth"
              @change="changeNodeStrokeWidth"
            ></el-input>
          </el-form-item>
          <el-form-item label="边框颜色">
            <el-color-picker
              v-model="nodeForm.stroke"
              show-alpha
              @change="changeNodeStroke"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="文本">
            <el-input
              v-model="nodeForm.text"
              @change="changeNodeText"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="">
            <el-button type="text" @click="deleteEdgeText">删除文本</el-button>
          </el-form-item> -->
          <el-form-item label="字体颜色" label-width="80px">
            <el-color-picker
              v-model="nodeForm.textColor"
              show-alpha
              @change="changeNodeTextColor"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="字体大小">
            <el-input
              v-model="nodeForm.fontSize"
              @change="changeNodeTextSize"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="controlType === 'edge'">
      <div class="title">设置边</div>
      <div class="body">
        <el-form ref="edgeForm" :model="edgeForm" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="edgeForm.id" @change="changeNodeId"></el-input>
          </el-form-item>
          <el-form-item label="名字">
            <el-input
              v-model="edgeForm.name"
              @change="changeNodeName"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="text" @click="openChoose">选择数据</el-button>
          </el-form-item>
          <el-form-item label="线宽">
            <el-input
              v-model="edgeForm.width"
              @change="changeEdgeWidth"
            ></el-input>
          </el-form-item>
          <el-form-item label="虚线">
            <el-input
              v-model="edgeForm.strokeDasharray"
              @change="changeEdgeDasharray"
            ></el-input>
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker
              v-model="edgeForm.color"
              show-alpha
              @change="changeEdgeColor"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="文本">
            <el-input
              v-model="edgeForm.text"
              @change="changeEdgeText"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="text" @click="deleteEdgeText">删除文本</el-button>
          </el-form-item>
          <el-form-item label="字体颜色" label-width="80px">
            <el-color-picker
              v-model="edgeForm.textColor"
              show-alpha
              @change="changeEdgeTextColor"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="字体大小">
            <el-input
              v-model="edgeForm.fontSize"
              @change="changeEdgeTextSize"
            ></el-input>
          </el-form-item>
          <el-form-item label="流动">
            <el-switch v-model="edgeForm.move" @change="changeEdgeMove">
            </el-switch>
            <!-- <el-form-item label="逆向">
            <el-switch v-model="edgeForm.move" @change="changeEdgeMove">
          </el-switch> -->
          </el-form-item>
          <el-form-item label="显示箭头">
            <el-switch v-model="edgeForm.marker" @change="changeEdgeMarker">
            </el-switch>
          </el-form-item>
          <el-form-item label="箭头类型"> </el-form-item>

          <el-divider></el-divider>

          <el-form-item label="路径点x">
            <el-input v-model="edgeForm.verX"></el-input>
          </el-form-item>
          <el-form-item label="路径点y">
            <el-input v-model="edgeForm.verY"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="text" @click="addVertex">添加路径点</el-button>
          </el-form-item>
          <el-table
            :data="verticesTable"
            border
            style="width: 100%"
            height="200"
          >
            <el-table-column type="index" width="36"> </el-table-column>
            <el-table-column prop="x" label="x" width="79">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.x"
                  @change="changeVertex(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="y" label="y" width="79">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.y"
                  @change="changeVertex(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="56">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>

    <el-dialog title="" :visible.sync="chooseVisible" width="30%">
      <el-form :inline="true" :model="chooseForm">
        <el-form-item label="类型">
          <el-select
            v-model="chooseForm.chooseType"
            placeholder="请选择"
            @change="devTypeChange"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="chooseForm.chooseDev"
            filterable
            placeholder="请选择"
            @change="devChange"
          >
            <el-option
              v-for="item in devOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :model="showForm" label-width="50px">
        <el-form-item label="id">
          <el-input v-model="showForm.id"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="showForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseOver">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { subAndLine } from '@/api/oms/topo/graph'

export default {
  name: 'Control',
  props: ['controlType', 'selectCell', 'graph', 'nodeStatus', 'verticesTable'],
  data() {
    return {
      chooseVisible: false,
      chooseForm: {
        chooseType: '0',
        chooseDev: ''
      },
      typeOptions: [
        { label: '厂站', value: '0' },
        { label: '线路', value: '1' }
      ],
      devOptions: [],
      showForm: {
        id: '',
        name: ''
      },
      subList: [],
      lineList: [],
      subMap: {},
      lineMap: {},

      graphForm: {
        color: 'rgba(255, 255, 255, 1)',
        showGrid: true
      },
      nodeForm: {
        id: '',
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: '#000',
        stroke: '#000',
        strokeWidth: 2,
        textColor: '#000',
        fontSize: 14,
        text: '',
        angle: 0
      },
      edgeForm: {
        id: '',
        name: '',
        width: 0,
        strokeDasharray: 0,
        color: '#000',
        text: '',
        textColor: '#000',
        fontSize: 14,
        move: false,
        marker: false,
        verX: 0,
        verY: 0
      }
    }
  },
  mounted() {
    this.initData()
  },
  watch: {
    selectCell: {
      handler(val) {
        if (val) {
          if (val.isNode()) {
            this.nodeForm.id = val.id
            this.nodeForm.name = val.getData().name

            this.nodeForm.x = this.nodeStatus.x
            this.nodeForm.y = this.nodeStatus.y
            this.nodeForm.width = this.nodeStatus.width
            this.nodeForm.height = this.nodeStatus.height
            if (val.store.data.shape !== 'image') {
              this.nodeForm.color = val.store.data.attrs.body.fill
              this.nodeForm.strokeWidth = val.store.data.attrs.body.strokeWidth
                ? Number(val.store.data.attrs.body.strokeWidth)
                : 2
              this.nodeForm.stroke = val.store.data.attrs.body.stroke
            }
            this.nodeForm.text = val.store.data.attrs.label
              ? val.store.data.attrs.label.text
              : ''
            this.nodeForm.textColor = val.store.data.attrs.label
              ? val.store.data.attrs.label.fill
              : '#000'
            this.nodeForm.fontSize = val.store.data.attrs.text
              ? Number(val.store.data.attrs.text.fontSize)
              : 14
            this.nodeForm.angle = val.getAngle()
          } else {
            this.edgeForm.id = val.id
            this.edgeForm.name = val.getData().name

            this.edgeForm.width = Number(val.store.data.attrs.line.strokeWidth)
            this.edgeForm.strokeDasharray = Number(
              val.store.data.attrs.line.strokeDasharray
            )
            this.edgeForm.color = val.store.data.attrs.line.stroke
            this.edgeForm.text = val.store.data.labels
              ? val.store.data.labels[0].attrs.label.text
              : ''
            this.edgeForm.textColor = val.store.data.labels
              ? val.store.data.labels[0].attrs.text.fill
              : '#000'
            this.edgeForm.fontSize = val.store.data.labels
              ? Number(val.store.data.labels[0].attrs.text.fontSize)
              : 14
            this.edgeForm.move =
              val.store.data.attrs.line.style.animation == 'none' ? false : true
            this.edgeForm.marker =
              Number(val.store.data.attrs.line.targetMarker.size) === 1
                ? false
                : true
          }
        }
      },
      immediate: true,
      deep: false
    },
    nodeStatus: {
      handler(val) {
        this.nodeForm.x = val.x
        this.nodeForm.y = val.y
        this.nodeForm.width = val.width
        this.nodeForm.height = val.height
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initData() {
      // subAndLine().then((res) => {
      //   this.lineList = res.line
      //   this.subList = res.station
      //   this.devOptions = res.station
      //   for (let i = 0; i < res.station.length; i++) {
      //     this.subMap[res.station[i]['id']] = res.station[i]['name']
      //   }
      //   for (let i = 0; i < res.line.length; i++) {
      //     this.lineMap[res.line[i]['id']] = res.line[i]['name']
      //   }
      // })
    },
    devTypeChange() {
      // this.devOptions = []
      if (this.chooseForm.chooseType == '0') {
        this.devOptions = this.subList
      } else {
        this.devOptions = this.lineList
      }
      this.chooseForm.chooseDev = ''
      this.showForm.name = ''
      this.showForm.id = ''
    },
    devChange(val) {
      if (this.chooseForm.chooseType === '0') {
        this.showForm.name = this.subMap[val]
      } else {
        this.showForm.name = this.lineMap[val]
      }
      this.showForm.id = val
    },
    chooseOver() {
      if (this.controlType === 'node') {
        this.nodeForm.name = this.showForm.name
        this.changeNodeName()
        // 需要后设置id，否则名字更新失败
        // 不能更新为相同的id，否则节点消失
        if (this.nodeForm.id != this.showForm.id) {
          this.nodeForm.id = this.showForm.id
          this.graph.updateCellId(this.selectCell, this.showForm.id)
        }
      } else {
        this.edgeForm.name = this.showForm.name
        this.changeNodeName()
        if (this.edgeForm.id !== this.showForm.id) {
          this.edgeForm.id = this.showForm.id
          this.graph.updateCellId(this.selectCell, this.showForm.id)
        }
      }

      this.chooseVisible = false

      this.chooseForm.chooseType = '0'
      this.chooseForm.chooseDev = ''
      this.showForm.name = ''
      this.showForm.id = ''
    },
    openChoose() {
      this.chooseForm.chooseType = '0'
      this.devOptions = this.subList
      this.chooseVisible = true
    },
    changeBgColor(val) {
      this.graph.drawBackground({
        color: val
      })
    },
    showGrid(val) {
      val ? this.graph.showGrid() : this.graph.hideGrid()
    },
    changeNodeId() {
      let id = ''
      if (this.controlType === 'node') {
        id = this.nodeForm.id
      } else {
        id = this.edgeForm.id
      }
      this.graph.updateCellId(this.selectCell, id)
    },
    changeNodeName() {
      let newName = ''
      if (this.controlType === 'node') {
        newName = this.nodeForm.name
      } else {
        newName = this.edgeForm.name
      }
      this.selectCell.updateData({
        name: newName
      })
    },
    changeNodeX(x) {
      this.nodeForm.x = x
      this.selectCell.position(Number(x), Number(this.nodeForm.y))
    },
    changeNodeY(y) {
      this.nodeForm.y = y
      this.selectCell.position(Number(this.nodeForm.x), Number(y))
    },
    changeNodeWidth(width) {
      this.nodeForm.width = width
      this.selectCell.resize(Number(width), Number(this.nodeForm.height))
    },
    changeNodeHeight(height) {
      this.nodeForm.height = height
      this.selectCell.resize(Number(this.nodeForm.width), Number(height))
    },
    changeEdgeWidth(width) {
      this.edgeForm.width = width
      this.selectCell.attr('line/strokeWidth', Number(width))
    },
    changeEdgeDasharray(val) {
      this.edgeForm.strokeDasharray = val
      this.selectCell.attr('line/strokeDasharray', Number(val))
    },
    changeEdgeColor(val) {
      this.edgeForm.color = val
      this.selectCell.attr('line/stroke', val)
    },
    changeEdgeText(val) {
      this.edgeForm.text = val
      this.selectCell.setLabels({
        attrs: { label: { text: val } }
      })
      this.selectCell.setLabels({
        attrs: {
          label: {
            text: val
          },
          text: {
            fill: this.edgeForm.textColor,
            fontSize: this.edgeForm.fontSize
          }
        }
      })
    },
    deleteEdgeText() {
      this.selectCell.removeLabelAt(0)
      this.edgeForm.text = ''
    },
    changeEdgeTextColor(val) {
      this.edgeForm.textColor = val
      this.selectCell.setLabels({
        attrs: {
          label: {
            text: this.edgeForm.text
          },
          text: {
            fill: val,
            fontSize: this.edgeForm.fontSize
          }
        }
      })
    },
    changeEdgeTextSize(val) {
      this.edgeForm.fontSize = val
      this.selectCell.setLabels({
        attrs: {
          label: {
            text: this.edgeForm.text
          },
          text: {
            fill: this.edgeForm.textColor,
            fontSize: val
          }
        }
      })
    },
    changeEdgeMove(val) {
      if (val) {
        this.selectCell.attr(
          'line/style/animation',
          'ant-line 30s infinite linear'
        )
      } else {
        this.selectCell.attr('line/style/animation', 'none')
      }
    },
    changeEdgeMarker(val) {
      if (val) {
        this.selectCell.attr('line/targetMarker/size', 8)
      } else {
        this.selectCell.attr('line/targetMarker/size', 1)
      }
    },
    changeNodeColor(val) {
      this.nodeForm.color = val
      this.selectCell.attr('body/fill', val)
    },
    changeNodeStrokeWidth(val) {
      this.nodeForm.strokeWidth = val
      this.selectCell.attr('body/strokeWidth', val)
    },
    changeNodeStroke(val) {
      this.nodeForm.stroke = val
      this.selectCell.attr('body/stroke', val)
    },
    changeNodeText(val) {
      this.nodeForm.text = val
      this.selectCell.attr('label/text', val)
    },
    changeNodeTextColor(val) {
      this.nodeForm.textColor = val
      this.selectCell.attr('label/fill', val)
    },
    changeNodeTextSize(val) {
      this.nodeForm.fontSize = val
      this.selectCell.attr('text/fontSize', val)
    },
    changeNodeAngle(val) {
      this.nodeForm.angle = val
      this.selectCell.rotate(Number(val), { absolute: true })
    },
    handleDelete(index) {
      this.selectCell.removeVertexAt(index)
      // this.verticesTable.splice(index, 1)
    },
    addVertex() {
      // this.verticesTable.push({
      //   x: this.edgeForm.verX,
      //   y: this.edgeForm.verY
      // })
      this.selectCell.appendVertex({
        x: this.edgeForm.verX,
        y: this.edgeForm.verY
      })
    },
    changeVertex(index, row) {
      this.selectCell.setVertexAt(index, {
        x: Number(row.x),
        y: Number(row.y)
      })
    },
    moveEdgeVertices(arr) {
      // this.verticesTable = arr
    },
    nodeRotated(angle) {
      this.nodeForm.angle = angle
    }
  }
}
</script>

<style scoped>
/* div {
  border: 1px solid black;
} */

#control {
  width: 100%;
  height: 100%;
  border: 1px solid #f0f0f0;
  background-color: #f5f5f5;
}

#control > div {
  height: 100%;
}

.title {
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  background-color: #ededed;
}

.body {
  height: calc(100% - 45px);
  padding-top: 20px;
  padding-right: 10px;
  overflow-y: auto;
}
</style>
