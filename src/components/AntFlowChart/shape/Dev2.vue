<template>
  <div style="height: 80px;width: 80px;display: flex;align-items: center;justify-content: center;">
    <div style="height: 44px;width:44px;position: relative;">
      <div
        style="height: 100%;width: 100%;overflow: hidden;border-radius:50%;border:1px solid #10928a;background-color: white;display: flex;align-items: center;flex-direction: column;">
        <span :style="{ color: numColor }">{{ load }}</span>
        <span>{{ persentage }}</span>
      </div>
      <!-- left -->
      <QuarterCircle type="left" :color="leftColor" style="position: absolute;left:-44px;top:0" />
      <span style="position: absolute;left: -16px;top: 50%;transform: translate(0,-50%);">1</span>
      <!-- right -->
      <QuarterCircle type="right" :color="rightColor" style="position: absolute;left:44px;top:0" />
      <span style="position: absolute;right: -16px;top: 50%;transform: translate(0,-50%);">2</span>
      <!-- top -->
      <QuarterCircle type="top" :color="topColor" style="position: absolute;left:0;top:-44px;" />
      <span style="position: absolute;top: -22px;left: 50%;transform: translate(-50%,0);">3</span>
      <!-- bottom -->
      <QuarterCircle type="bottom" :color="bottomColor" style="position: absolute;left:0;top:44px;" />
      <span style="position: absolute;bottom: -22px;left: 50%;transform: translate(-50%,0);">4</span>
    </div>
  </div>
</template>

<script>
import QuarterCircle from '@/components/Chart/quarter-circle.vue'
export default {
  name: 'Dev',
  inject: ['getGraph', 'getNode'],
  components: {
    QuarterCircle
  },
  data() {
    return {
      id: '',
      img: 'e',
      load: '——',
      persentage: '23%',
      loadRate: 0,
      topColor: 'rgba(181, 191, 203, 1)',
      leftColor: 'rgba(181, 191, 203, 0.05)',
      rightColor: 'rgba(181, 191, 203, 0.05)',
      bottomColor: 'rgba(181, 191, 203, 0.05)',
      numColor: '#000000',
      stId: '',
      jxtype: '',
      transformers: [],
      transfColorArr: ['#ffffff', '#479EA0', '#FF9F41', '#E05D5D']
    }
  },
  mounted() {
    const self = this
    const node = this.getNode()
    this.load = '——'
    const obj = JSON.parse(JSON.stringify(node))
    console.log(obj)
    if (obj.specialSt !== null && obj.specialSt !== undefined && obj.specialSt === '1') {
      // 特殊变电站
      this.id = obj.id // 图例给定id
      this.load = obj.properties.load === null ? 0 : obj.properties.load
      this.stId = obj.specialstId
      // this.numColor = (this.jxtype !== null && this.jxtype === 'jx') ? '#f67070' : '#e3fff8'
      this.loadRate = obj.properties.loadRate == null ? 0 : obj.properties.loadRate
      this.jxtype = obj.jxtype
      this.transformers = obj.transformers
      // console.log(obj.properties)
      // 根据电压等级修改图例
      // if (obj.properties.dydj === '500kV') {
      //   this.img = 'c'
      // } else if (obj.properties.dydj === '220kV') {
      //   this.img = 'a'
      // } else if (obj.properties.dydj === '110kV') {
      //   this.img = 'b'
      // } else if (obj.properties.dydj === '35kV') {
      //   this.img = 'd'
      // } else {
      //   this.img = 'a'
      // }
      // 根据变压器为四个角修改配色
      if (this.transformers !== null && this.transformers.length > 0) {
        for (let i = 0; i < this.transformers.length; i++) {
          const eachLoadRate = this.transformers[i].loadRate
          // 1#变压器
          let colorPosition = ''
          if (i === 0) {
            colorPosition = 'topColor'
          }
          if (i === 1) {
            colorPosition = 'rightColor'
          }
          if (i === 2) {
            colorPosition = 'bottomColor'
          }
          if (i === 3) {
            colorPosition = 'leftColor'
          }
          if (Number(eachLoadRate) < 80) {
            this[colorPosition] = this.transfColorArr[1]
          } else if (Number(eachLoadRate) >= 80 && Number(eachLoadRate) < 100) {
            this[colorPosition] = this.transfColorArr[2]
          } else if (Number(eachLoadRate) >= 100) {
            this[colorPosition] = this.transfColorArr[3]
          } else {
            this[colorPosition] = this.transfColorArr[0]
          }
        }
      }
    }
    // 监听数据改变事件
    node.on('change:data', ({ current }) => {
      for (const key in current) {
        self[key] = current[key]
      }
      console.log(current)
    })
  },
  methods: {
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
  border: 1px solid #2ECDBA;
  box-shadow: 0 0 10px #44D28A;
  background-color: #FFFFFF;
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


</style>
