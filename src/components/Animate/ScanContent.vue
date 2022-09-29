<template>
  <div style="position: relative">
    <div :class="enable ? 'animate' : ''">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScanContent',
  components: {},
  props: {
    target: {
      type: String,
      require: false,
      default: 'current'
    },
    enable: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  data() {
    return {
      animate: true
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.animate {
  position: fixed;
  border-top: 8px solid rgb(27, 179, 255);
  height: 30%;
  background-image: linear-gradient(
    rgba(0, 88, 183, 0.797) 0,
    transparent 100%
  );
  left: 0;
  top: 0;
  width: 100%;
  pointer-events: none;
  animation: autoMove 4s infinite ease-in-out;
}

@keyframes autoMove {
  0% {
    top: 100%;
  }

  100% {
    top: -30%;
  }
}
</style>
