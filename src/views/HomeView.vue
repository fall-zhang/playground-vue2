<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <Teleport to="#tpp" name="queue">
      传送到 Tpp 谢谢
    </Teleport>
    <AntVPageLower />
  </div>
</template>

<script>
// import { Transport } form 'vue'
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import AntVPageLower from '@/components/AntFlowChart/index.vue'
// console.log(AntVPageLower.props)
export default {
  name: 'HomeView',
  components: {
    // HelloWorld,
    AntVPageLower
  },
  mounted() {
    console.log(this.$route)
  }
}
</script>
