<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <AntVPageLower />
  </div>
</template>

<script>
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
