<template>
  <div>
    <div :class="animate?'animate':''">

    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ScanContent',
  components: {

  },
  props: {},
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" >
.animate {
  position: absolute;
  border-top: 8px solid rgb(27, 179, 255);
  height: 30%;
  background-image: linear-gradient(rgba(0, 88, 183, 0.797) 0, transparent 100%);
  left: 0;
  top: 0;
  width: 100%;
  animation: autoMove 4s infinite ease-in-out;
}
</style>
