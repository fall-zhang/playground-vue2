<template>
  <div style="width: 120px; height: 120px">
    <div class="circle-top abs-left" :style="{ borderColor: topColor }"></div>
    <div class="circle-left abs-left" :style="{ borderColor: leftColor }"></div>
    <div class="circle11 abs-left"></div>
    <!--    <div class="circle-img abs-left"></div>-->
    <div
      :id="id"
      v-if="img === 'a'"
      class="circle-img abs-left circle-img-a"
    ></div>
    <div
      :id="id"
      v-if="img === 'b'"
      class="circle-img abs-left circle-img-b"
    ></div>
    <div
      :id="id"
      v-if="img === 'c'"
      class="circle-img abs-left circle-img-c"
    ></div>
    <div
      :id="id"
      v-if="img === 'd'"
      class="circle-img abs-left circle-img-d"
    ></div>
    <div
      :id="id"
      v-if="img === 'e'"
      class="circle-img abs-left circle-img-e"
    ></div>
    <div
      :id="id"
      v-if="img === 'f'"
      class="circle-img abs-left circle-img-f"
    ></div>
    <div
      :id="id"
      v-if="img === 'g'"
      class="circle-img abs-left circle-img-g"
    ></div>
    <div class="circle-font abs-left" style="cursor: pointer">
      <div style="height:100%;width: 100%;position: relative;">
        <!-- <span :style="{ color: numColor }">{{ load }}</span> -->
        <div style="width: 100%;height: 30px;display:flex;align-items:center;justify-content: center;">
          <span :style="{ color: 'white' }">{{ load }}</span>
        </div>
      </div>
    </div>
    <div
      class="circle-right abs-left"
      :style="{ borderColor: rightColor }"
    ></div>
    <div
      class="circle-bottom abs-left"
      :style="{ borderColor: bottomColor }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'Dev',
  inject: ['getGraph', 'getNode'],
  data() {
    return {
      id: '',
      img: 'g',
      load: '——',
      loadRate: 0,
      topColor: 'rgba(181, 191, 203, 0.05)',
      leftColor: 'rgba(181, 191, 203, 0.05)',
      rightColor: 'rgba(181, 191, 203, 0.05)',
      bottomColor: 'rgba(181, 191, 203, 0.05)',
      numColor: '#ffffff',
      stId: '',
      jxtype: '',
      transformers: [],
      transfColorArr: ['rgba(217,243,248,0.5)', '#ece178', '#f89754', '#ff5d41']
    }
  },
  mounted() {
    const self = this
    const node = this.getNode()
    this.load = '——'
    let obj = JSON.parse(JSON.stringify(node))
    if (
      obj.specialSt !== null &&
      obj.specialSt !== undefined &&
      obj.specialSt === '1'
    ) {
      // 特殊变电站
      this.id = obj.id // 图例给定id
      this.load = obj.properties.load === null ? 0 : obj.properties.load
      this.stId = obj.specialstId
      this.numColor =
        this.jxtype !== null && this.jxtype === 'jx' ? '#f67070' : '#e3fff8'
      this.loadRate =
        obj.properties.loadRate == null ? 0 : obj.properties.loadRate
      this.jxtype = obj.jxtype
      this.transformers = obj.transformers
      // console.log(obj.properties)
      // 根据电压等级修改图例
      if (obj.properties.dydj === '500kV') {
        this.img = 'c'
      } else if (obj.properties.dydj === '220kV') {
        this.img = 'a'
      } else if (obj.properties.dydj === '110kV') {
        this.img = 'b'
      } else if (obj.properties.dydj === '35kV') {
        this.img = 'd'
      } else {
        this.img = 'g'
      }
      // 根据变压器为四个角修改配色
      if (this.transformers !== null && this.transformers.length > 0) {
        for (let i = 0; i < this.transformers.length; i++) {
          let eachLoadRate = this.transformers[i].loadRate
          // 1#变压器
          if (i === 0) {
            if (Number(eachLoadRate) >= 80 && Number(eachLoadRate) < 90) {
              this.topColor = this.transfColorArr[1]
            } else if (
              Number(eachLoadRate) >= 90 &&
              Number(eachLoadRate) < 100
            ) {
              this.topColor = this.transfColorArr[2]
            } else if (Number(eachLoadRate) >= 100) {
              this.topColor = this.transfColorArr[3]
            } else {
              this.topColor = this.transfColorArr[0]
            }
          }
          if (i === 1) {
            if (Number(eachLoadRate) >= 80 && Number(eachLoadRate) < 90) {
              this.rightColor = this.transfColorArr[1]
            } else if (
              Number(eachLoadRate) >= 90 &&
              Number(eachLoadRate) < 100
            ) {
              this.rightColor = this.transfColorArr[2]
            } else if (Number(eachLoadRate) >= 100) {
              this.rightColor = this.transfColorArr[3]
            } else {
              this.rightColor = this.transfColorArr[0]
            }
          }
          if (i === 2) {
            if (Number(eachLoadRate) >= 80 && Number(eachLoadRate) < 90) {
              this.bottomColor = this.transfColorArr[1]
            } else if (
              Number(eachLoadRate) >= 90 &&
              Number(eachLoadRate) < 100
            ) {
              this.bottomColor = this.transfColorArr[2]
            } else if (Number(eachLoadRate) >= 100) {
              this.bottomColor = this.transfColorArr[3]
            } else {
              this.bottomColor = this.transfColorArr[0]
            }
          }
          if (i === 3) {
            if (Number(eachLoadRate) >= 80 && Number(eachLoadRate) < 90) {
              this.leftColor = this.transfColorArr[1]
            } else if (
              Number(eachLoadRate) >= 90 &&
              Number(eachLoadRate) < 100
            ) {
              this.leftColor = this.transfColorArr[2]
            } else if (Number(eachLoadRate) >= 100) {
              this.leftColor = this.transfColorArr[3]
            } else {
              this.leftColor = this.transfColorArr[0]
            }
          }
          if (obj.zb === 0) {
            this.topColor = this.transfColorArr[3]
          } else if (obj.zb === 1) {
            this.rightColor = this.transfColorArr[3]
          } else if (obj.zb === 2) {
            this.bottomColor = this.transfColorArr[3]
          } else if (obj.zb === 3) {
            this.leftColor = this.transfColorArr[3]
          }
        }
      }
      // console.log(obj);
      if (obj.borderColor) {
        switch (obj.transformers.length) {
        case 4:
          this.leftColor = obj.transformers[3]
        case 3:
          this.bottomColor = obj.transformers[2]
        case 2:
          this.rightColor = obj.transformers[1]
        case 1:
          this.topColor = obj.transformers[0]
        }
      }
    }
    if (obj.subGl !== null && obj.subGl !== undefined) {
      this.load = obj.subGl
    }
    // console.log(obj.subGl)
    // 监听数据改变事件
    node.on('change:data', ({ current }) => {
      for (let key in current) {
        self[key] = current[key]
      }
    })
  },
  methods: {
    picChange(devId) {
      if (devId) {
        for (let i = 0; i < this.transformers.length; i++) {
          for (let j = 0; j < devId.length; j++) {
            if (this.transformers === devId[j]) {
              if (j === 0) {
                this.topColor = this.transfColorArr[3]
              }
              if (j === 1) {
                this.rightColor = this.transfColorArr[3]
              }
              if (j === 2) {
                this.bottomColor = this.transfColorArr[3]
              }
              if (j === 3) {
                this.leftColor = this.transfColorArr[3]
              }
            }
          }
        }
      } else {
        this.leftColor = this.transfColorArr[0]
        this.topColor = this.transfColorArr[0]
        this.rightColor = this.transfColorArr[0]
        this.bottomColor = this.transfColorArr[0]
      }
    }
  }
}
</script>

<style scoped>
.circle-top {
  width: 30px;
  height: 30px;
  border: 5px solid red;
  border-radius: 35px 0 0 0;
  border-right: none;
  border-bottom: none;
  transform: rotate(45deg);
  top: calc(-4px - 4px);
  left: calc(26px - 4px);
}

.circle-right {
  width: 30px;
  height: 30px;
  border: 5px solid red;
  border-radius: 0 35px 0 0;
  border-left: none;
  border-bottom: none;
  transform: rotate(45deg);
  top: calc(26px - 4px);
  left: calc(55px - 4px);
}

.circle-bottom {
  width: 30px;
  height: 30px;
  border: 5px solid red;
  border-radius: 0 0 35px 0;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
  top: calc(55px - 4px);
  left: calc(26px - 4px);
}

.circle-left {
  width: 30px;
  height: 30px;
  border: 5px solid red;
  border-radius: 0 0 0 35px;
  border-top: none;
  border-right: none;
  transform: rotate(45deg);
  top: calc(26px - 4px);
  left: calc(-4px - 4px);
}

.circle-shadow {
  width: 60px;
  height: 60px;
  border: 4px solid #6483eb66;
  border-radius: 50%;
  top: 10px;
  left: 9px;
}

.circle11 {
  width: 50px;
  height: 50px;
  border: 2px solid #5da3d3;
  box-shadow: 0 0 15px #005efb;
  background-color: #07234f;
  border-radius: 50%;
  top: calc(15px - 4px);
  left: calc(11.5px);
}

.circle-img {
  width: 50.6px;
  height: 50.6px;
  /* border: 1px solid #64ff1d; */
  border-radius: 50%;
  top: calc(17.5px - 5px);
  left: calc(17.5px - 5.2px);
}

.circle-img {
  /* background-image: url('../../assets/img/topo/c.png'); */
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.circle-img-a {
  /* background-image: url(../../assets/img/topo/a.png); */
}

.circle-img-b {
  /* background-image: url(../../assets/img/topo/b.png); */
}

.circle-img-c {
  /* background-image: url(../../assets/img/topo/c.png); */
}

.circle-img-d {
  /* background-image: url(../../assets/img/topo/d.png); */
}

.circle-img-e {
  /* background-image: url(../../assets/img/topo/e.png); */
}

.circle-img-f {
  /* background-image: url(../../assets/img/topo/f.png); */
}

.circle-img-g {
  /* background-image: url(../../assets/img/topo/g.png); */
}

.circle-img-h {
  /* background-image: url(../../assets/img/topo/g.png); */
}

.circle-font {
  /* width: 35px;
  height: 30px; */
  /* top: calc(27px - 4px);
  left: calc(24px - 4px); */
  font-size: 14px;
  /* text-align: center; */
  /* line-height: 30px; */
  color: #ffffff;
}

.abs-left {
  position: absolute;
}
</style>
