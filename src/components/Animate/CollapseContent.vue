<template>
  <div class="collapse">
    <div class="content" ref="content" :class="isCollapse ? 'shrink' : 'large'">
      <slot></slot>
    </div>
    <el-button
      class="button"
      type="primary"
      @click="onToggleCollapse"
      :icon="isCollapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
    >
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'CollapseForm',
  props: {},
  data() {
    return {
      isCollapse: true,
      childCount: 0
    }
  },
  mounted() {
    this.childCount = this.$refs['content'].childElementCount
    console.log(this.childCount)
  },
  methods: {
    onToggleCollapse() {
      this.isCollapse = !this.isCollapse
      // if (this.isCollapse) {
      //   this.$refs['content'].style.height = '40px'
      // } else {
      //   this.$refs['content'].style.height =
      // Math.ceil(this.childCount / 4) * 44 + 'px'
      // }
    }
  }
}
</script>

<style scoped lang="scss">
.collapse {
  display: flex;
  width: 100%;

  .content {
    flex: 1 1;
    display: flex;
    flex-flow: row wrap;
    background-color: pink;
    border-radius: 4px;
    justify-content: flex-end;
    // align-content: flex-start;
    align-items: flex-start;
    transition: 0.5s ease-in-out;
    overflow: hidden;
    > button {
      margin: 2px;
    }
    &.shrink {
      height: 44px;
    }

    &.large {
      height: 360px;
      // transform: scale(1, 6);
      // transform: scale(1, 60px);
      // transform-origin: top;
    }
  }

  .button {
    margin: 2px;
    flex: 0 0 80px;
    height: 40px;
  }
}
</style>
