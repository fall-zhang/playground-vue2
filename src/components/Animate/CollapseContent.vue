<template>
  <div class="collapse">
    <div class="items_content" ref="content">
      <div class="content" :class="isCollapse ? 'shrink' : 'large'">
        <el-button v-for="i in 32" :key="i">者重中之重{{i}}</el-button>
        <slot></slot>
      </div>
    </div>
    <el-button class="button" type="primary" @click="onToggleCollapse"
      :icon="isCollapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up'">
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
      // overflow hidden
      if (this.isCollapse) {
        this.$refs['content'].style.overflow = 'hidden'
      } else {
        this.$refs['content'].style.overflow = 'initial'
      }
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

  .items_content {
    flex: 1 1;
    height: 40px;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    align-items: flex-start;
    overflow: hidden;

    >button {
      margin: 2px;
    }

    .content {
      width: 100%;
      transition: 0.5s ease-in-out;
      // background-color: magenta;
      border-radius: 4px;

      &.shrink {
        height: 120px;
      }

      &.large {
        height: 360px;
      }
    }
  }

  button {
    margin: 2px;
    flex: 0 0 80px;
    // height: 40px;
  }
}
</style>
