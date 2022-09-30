<template>
  <div class="home">
    <AntVPageLower />
  </div>
</template>

<script>
import AntVPageLower from '@/components/AntFlowChart/index.vue'
export default {
  name: 'HomeView',
  components: {
    AntVPageLower
  },
  mounted() {
    console.log(this.$route)
  }
}
</script>
