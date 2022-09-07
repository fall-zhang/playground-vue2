<template>
  <div id="editView">
    <div class="top-btn-group">
      <el-button @click="toJson">保存</el-button>
      <el-button @click="fromJson">导入</el-button>
      <!-- <el-button @click="exportPng">导出图片</el-button> -->
      <el-button @click="undo">撤销</el-button>
      <el-button @click="redo">重做</el-button>
      <el-button @click="big" icon="el-icon-zoom-in"></el-button>
      <el-button @click="small" icon="el-icon-zoom-out"></el-button>
      <el-button @click="centerContent">居中</el-button>
      <el-button @click="deleteCell">删除</el-button>
      <el-button type="text" style="color: #000">路径点</el-button>
      <el-switch v-model="isLineEdit"> </el-switch>
      <el-button type="text" style="color: #000">边颜色</el-button>
      <el-color-picker
        v-model="defaultLineColor"
        show-alpha
        size="medium"
      ></el-color-picker>
      <el-dropdown @command="routerCommand">
        <el-button>
          路由<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="normal">默认路由</el-dropdown-item>
          <el-dropdown-item command="orth">正交路由</el-dropdown-item>
          <el-dropdown-item command="er">实体关系路由</el-dropdown-item>
          <el-dropdown-item command="oneSide">单侧路由</el-dropdown-item>
          <el-dropdown-item command="manhattan">智能正交路由</el-dropdown-item>
          <el-dropdown-item command="metro">智能地铁线路由</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <el-button @click="test">数字</el-button> -->
      <el-dropdown @command="connectorCommand">
        <el-button>
          连接器<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="normal">简单连接器</el-dropdown-item>
          <el-dropdown-item command="smooth">平滑连接器</el-dropdown-item>
          <el-dropdown-item command="rounded">圆角连接器</el-dropdown-item>
          <el-dropdown-item command="jumpover">跳线连接器</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-button @click="changeSnap">吸附</el-button> -->
    </div>
    <div class="content">
      <div class="edit-stencil" ref="stencilContainer"></div>
      <div class="edit-graph" ref="container"></div>
      <!-- <div ref="minimapContainer">
      </div> -->

      <div class="right-ctrl">
        <Control
          ref="control"
          :controlType="controlType"
          :selectCell="selectCell"
          :graph="graph"
          :nodeStatus="nodeStatus"
          :verticesTable="verticesTable"
        ></Control>
      </div>
    </div>
    <el-dialog title="导入图纸" :visible.sync="importVisible" width="30%">
      <el-table :data="importTableData" style="width: 100%" height="300">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="NAME" label="图纸名称"> </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleImport(scope.$index, scope.row)"
              >导入</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { Graph, Shape, Addon, DataUri } from "@antv/x6";
import "@antv/x6-vue-shape";
import * as cp from "./shape.js";
// import { deleteGraph, saveJson, getGraph, getJson } from "@/api/oms/topo/graph";
import Control from "./Control.vue";
// import insertCss from "insert-css";
import imageSvg from "@/assets/img/topo/image.svg";

const { Stencil } = Addon;
const { Rect, Circle, Cylinder, Ellipse, Image } = Shape;
export default {
  name: "EditView",
  components: { Control },
  data() {
    return {
      selectedNodeId: "",
      graph: "",
      stencil: "",
      router: "normal",
      connector: "normal",
      controlType: "graph",
      selectCell: "",
      verticesTable: [],
      nodeStatus: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      edgeSnap: false,
      defaultLineColor: "#1d92ff",
      isLineEdit: false,
      ports: {
        groups: {
          topGroup: {
            position: "top",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff",
              },
            },
          },
          bottomGroup: {
            position: "bottom",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff",
              },
            },
          },
          leftGroup: {
            position: "left",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff",
              },
            },
          },
          rightGroup: {
            position: "right",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff",
              },
            },
          },
        },
        items: [
          {
            id: "port1",
            group: "topGroup",
          },
          {
            id: "port2",
            group: "bottomGroup",
          },
          {
            id: "port3",
            group: "leftGroup",
          },
          {
            id: "port4",
            group: "rightGroup",
          },
        ],
      },
      portsEllipse: {
        groups: {
          group1: {
            position: "ellipseSpread",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff",
              },
            },
          },
        },
        items: [],
      },
      importVisible: false,
      importTableData: [],
    };
  },
  mounted() {
    this.init();
    this.graph.translate(0, 0);
  },
  methods: {
    init() {
      this.initGraph();
      this.registerEvents();
      this.initStencil();
      this.registerComponents();
      this.registerPrivateComponents();

      const stencilPorts =
        this.$refs.stencilContainer.querySelectorAll(".x6-port-body");
      this.showPorts(stencilPorts, false);
    },
    initGraph() {
      let that = this;
      const graph = new Graph({
        container: this.$refs.container,
        grid: true,
        history: true,
        selecting: {
          enabled: false,
          multiple: true,
          rubberband: true,
          movable: true,
          showNodeSelectionBox: true,
          showEdgeSelectionBox: true,
        },
        snapline: {
          enabled: true,
          sharp: true,
        },
        resizing: {
          enabled: false,
          orthogonal: false,
        },
        rotating: {
          enabled: false,
        },
        connecting: {
          snap: false,
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: that.defaultLineColor,
                  strokeDasharray: 0,
                  targetMarker: {
                    name: "classic",
                    size: 1,
                  },
                  style: {
                    animation: "none",
                  },
                },
              },
              labels: [
                {
                  attrs: {
                    label: {
                      text: "",
                    },
                    text: {
                      fill: "#000",
                      fontSize: 14,
                    },
                  },
                },
              ],
              connector: that.connector,
              router: {
                name: that.router,
              },
              zIndex: 0,
            });
          },
        },
        scroller: {
          enabled: true,
          pannable: true,
        },
        // minimap: {
        //   enabled: true,
        //   container: this.$refs.minimapContainer,
        // }
      });
      this.graph = graph;
    },
    registerEvents() {
      this.graph.on("cell:selected", (args) => {
        // console.log(args)
        this.selectedNodeId = args.cell.id;
      });
      this.graph.on("selection:changed", (args) => {
        args.added.forEach((cell) => {
          this.selectCell = cell;

          if (cell.isEdge() && this.isLineEdit) {
            return;
          }

          if (
            cell.getData() === undefined ||
            cell.getData().name === undefined
          ) {
            cell.setData({
              name: "",
            });
          }

          if (cell.isNode()) {
            const pos = cell.position();
            const size = cell.size();
            this.nodeStatus = {
              x: Number(pos.x),
              y: Number(pos.y),
              width: Number(size.width),
              height: Number(size.height),
            };
          } else {
            this.verticesTable = cell.getVertices();
          }
        });
      });
      this.graph.on("node:mouseenter", () => {
        const ports = this.$refs.container.querySelectorAll(".x6-port-body");
        this.showPorts(ports, true);
      });
      this.graph.on("node:mouseleave", ({ node }) => {
        node.removeTools();
        const ports = this.$refs.container.querySelectorAll(".x6-port-body");
        this.showPorts(ports, false);
      });

      this.graph.on("edge:mouseenter", ({ edge }) => {
        edge.addTools([
          { name: "segments" },
          { name: "source-arrowhead" },
          { name: "target-arrowhead" },
          // {
          //   name: 'button-remove',
          //   args: { distance: -40 },
          // }
        ]);

        if (this.isLineEdit) {
          edge.addTools([{ name: "vertices" }]);
        }
      });

      this.graph.on("edge:mouseleave", ({ edge }) => {
        edge.removeTools();
      });

      this.graph.on("blank:click", () => {
        this.controlType = "graph";

        const cells = this.graph.getCells();
        if (cells.length) {
          cells.forEach((cell) => {
            cell.removeTools();
            if (cell.isNode()) {
              const ports =
                this.$refs.container.querySelectorAll(".x6-port-body");
              this.showPorts(ports, false);
            }
          });
        }
      });
      this.graph.on("cell:click", ({ cell }) => {
        this.controlType = cell.isNode() ? "node" : "edge";
      });
      this.graph.on("node:moved", ({ node }) => {
        const pos = node.position();
        this.nodeStatus.x = pos.x;
        this.nodeStatus.y = pos.y;
      });
      this.graph.on("edge:moved", ({ edge }) => {
        this.$refs.control.moveEdgeVertices(edge.getVertices());
      });
      this.graph.on("node:resized", ({ node }) => {
        const size = node.size();
        this.nodeStatus.width = size.width;
        this.nodeStatus.height = size.height;
      });
      this.graph.on("node:rotated", ({ node }) => {
        this.$refs.control.nodeRotated(node.getAngle());
      });
    },
    initStencil() {
      const stencil = new Stencil({
        title: "组件",
        target: this.graph,
        search: false,
        collapsable: true,
        stencilGraphWidth: 200,
        stencilGraphHeight: 800,
        groups: [
          {
            name: "group1",
            title: "基本组件",
          },
          {
            name: "group2",
            title: "自定义组件",
          },
        ],
      });

      stencil.resizeGroup("group1", { width: 300, height: 300 });
      stencil.resizeGroup("group2", { width: 300, height: 450 });

      this.$refs.stencilContainer.appendChild(stencil.container);

      this.stencil = stencil;
    },
    registerComponents() {
      const rect = new Rect({
        width: 70,
        height: 40,
        ports: this.ports,
      });

      const circle = new Circle({
        width: 60,
        height: 60,
        ports: this.ports,
      });

      const ellipse = new Ellipse({
        width: 80,
        height: 40,
        ports: this.ports,
      });

      const image = new Image({
        width: 80,
        height: 50,
        imageUrl: imageSvg,
        ports: this.ports,
      });

      const cylinder = new Cylinder({
        width: 50,
        height: 80,
        ports: this.ports,
      });

      this.stencil.load([rect, circle, ellipse, image, cylinder], "group1");
    },
    registerPrivateComponents() {
      let portObj = JSON.stringify(this.portsEllipse);
      let ports8 = JSON.parse(portObj);
      let ports24 = JSON.parse(portObj);
      for (let i = 0; i < 8; i++) {
        ports8.items.push({
          id: "port" + i,
          group: "group1",
        });
      }
      console.log(ports8);
      for (let i = 0; i < 24; i++) {
        ports24.items.push({
          id: "port" + i,
          group: "group1",
        });
      }

      const CircleBlueWord = cp.circleBlueWord();
      const CircleBlue = cp.circleBlue();
      const CircleGreen = cp.circleGreen();
      const CircleRed = cp.circleRed();
      const CircleYellow = cp.circleYellow();
      const GreenWord = cp.greenWord();
      const Breaker = cp.breaker();
      const CircleBlack = cp.circleBlack();
      cp.dev();
      cp.factory();

      const circleBlueWord = new CircleBlueWord({
        width: 25,
        height: 25,
        label: "一",
        ports: ports8,
      });

      const circleBlue = new CircleBlue({
        width: 25,
        height: 25,
        ports: ports8,
      });

      const circleGreen = new CircleGreen({
        width: 25,
        height: 25,
        ports: ports8,
      });

      const circleRed = new CircleRed({
        width: 25,
        height: 25,
        ports: ports8,
      });

      const circleYellow = new CircleYellow({
        width: 25,
        height: 25,
        ports: ports8,
      });

      const greenWord = new GreenWord({
        width: 60,
        height: 30,
      });

      const breaker = new Breaker({
        width: 50,
        height: 25,
        ports: this.ports,
      });

      const circleBlack = new CircleBlack({
        width: 30,
        height: 30,
        ports: ports8,
      });

      let dev = {
        shape: "vue-shape",
        width: 80,
        height: 80,
        component: "dev",
        ports: ports24,
      };

      let factory = {
        shape: "vue-shape",
        width: 70,
        height: 55,
        component: "factory",
        ports: this.ports,
      };

      this.stencil.load(
        [
          dev,
          circleBlueWord,
          circleBlue,
          circleGreen,
          circleYellow,
          circleRed,
          greenWord,
          breaker,
          circleBlack,
          factory,
        ],
        "group2"
      );
    },
    toJson() {
      this.$prompt("请输入图纸名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          let param = new URLSearchParams();
          param.append("json", JSON.stringify(this.graph.toJSON()));
          param.append("name", value);
          saveJson({
            json: JSON.stringify(this.graph.toJSON()),
            name: value,
          }).then((res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: "已保存 " + value,
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消保存",
          });
        });
    },
    fromJson() {
      this.importVisible = true;

      getGraph().then((res) => {
        this.importTableData = res;
      });
    },
    undo() {
      this.graph.undo();
    },
    redo() {
      this.graph.redo();
    },
    centerContent() {
      this.graph.centerContent();
    },
    big() {
      this.graph.zoom(0.1);
    },
    small() {
      this.graph.zoom(-0.1);
    },
    test() {
      const nodes = this.graph.getNodes();
      if (nodes.length) {
        nodes.forEach((node) => {
          // const { num } = node.getData();
          node.setData({
            num: 600,
          });
        });
      }
    },
    showPorts(ports, show) {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? "visible" : "hidden";
      }
    },
    handleImport(index, row) {
      console.log(index, row);
      let that = this;
      getJson({
        id: row.ID,
      }).then((res) => {
        console.log(res);
        that.graph.fromJSON(res);
        that.importVisible = false;
      });
    },
    handleDelete(index, row) {
      console.log(index, row);
      deleteGraph({
        id: row.ID,
      }).then((res) => {
        console.log(res);
        this.importVisible = false;
      });
    },
    exportPng() {
      this.graph.toPNG((dataUri) => {
        DataUri.downloadDataUri(dataUri, "chart.png");
      });
    },
    changeSnap() {
      this.edgeSnap = false;
    },
    routerCommand(val) {
      this.router = val;
    },
    connectorCommand(val) {
      this.connector = val;
    },
    deleteCell() {
      this.graph.removeCells(this.graph.getSelectedCells());
      this.controlType = "graph";
    },
  },
};
</script>

<style scoped>
/* div {
  border: solid black 1px;
} */

#editView {
  width: 100%;
  height: 98vh;
  overflow: hidden;
}

.top-btn-group {
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  height: 95%;
}

.edit-stencil {
  width: 13%;
  border: 1px solid #f0f0f0;
  position: relative;
}

.edit-graph {
  flex: 1;
  width: 70%;
  margin-left: 5px;
  margin-right: 5px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.right-ctrl {
  width: 15%;
}

.x6-graph-scroller {
  border: 1px solid #f0f0f0;
  margin-left: -1px;
}
</style>
