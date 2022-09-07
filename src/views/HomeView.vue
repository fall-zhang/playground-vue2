<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <GraphEdit />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { GraphEdit } from '@/components/AntXGraph'
export default {
  name: 'HomeView',
  components: {
    // HelloWorld,
    GraphEdit
  }
}
</script>
