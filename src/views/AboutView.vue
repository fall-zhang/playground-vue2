<template>
  <div class="about">
    <ImageButton />
    <!-- <router-view></router-view> -->
    <button @click="onClick">点击 </button>
  </div>
</template>
<script>
import ImageButton from '@/components/ImageButton/SvgAndContent.vue'
export default {
  components: {
    ImageButton
  },
  data() {
    return {
      animate: true
    }
  },
  methods: {
    onClick() {
      console.log(this.$router)
      postMessage('发送一点内容', 'http://localhost:8081/')
      this.$router.push({ name: 'home', params: { apple: 'ddd' } })
    }
  }
}
</script>
<style lang="scss">

</style>