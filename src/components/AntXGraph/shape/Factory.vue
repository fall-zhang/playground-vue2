<template>
  <div style="width: 70px; height: 55px">
    <div id="border-div"></div>
    <div id="triangle"></div>
  </div>
</template>

<script>
export default {
  name: 'Factory',
  inject: ['getGraph', 'getNode'],
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped>
#border-div {
  width: 70px;
  height: 55px;
  border: 2px solid #000000;
  position: absolute;
  top: 0px;
  left: 0px;
  float: left;
}

#triangle {
  float: left;
  height: 0px;
  width: 0px;
  z-index: 1;
  border-left: 36px solid transparent;
  border-right: 36px solid transparent;
  border-bottom: 57px solid #000000;
}

#triangle:after {
  content: '';
  z-index: 99;
  position: absolute;
  top: 2px;
  left: 2px;
  border-left: 34px solid transparent;
  border-right: 34px solid transparent;
  border-bottom: 55px solid white;
}
</style>
