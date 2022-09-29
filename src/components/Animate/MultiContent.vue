<template>
  <div>
    <el-button size="small" type="primary" @click="onRandomAdd">
      随机添加节点
    </el-button>
    <el-button size="small" type="danger" @click="onRandomRemove">
      随机删除节点
    </el-button>
    <el-button size="small" type="success" @click="onShuffle">
      随机移动节点
    </el-button>
    <TransitionGroup name="list" tag="ul" class="container">
      <li class="item" v-for="(item,index) in list" :key="item">
        <div>
          {{ '飞翔'+item }}
          <button @click="onDelete(index)">
            删除
          </button>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<script>
import shuffle from '@/utils/shuffle.js'
export default {
  name: 'MultiContent',
  props: {},
  data() {
    return {
      list: [1, 2, 3, 4, 5],
      current: 6
    }
  },
  methods: {
    onDelete(index) {
      this.list.splice(index, 1)
    },
    onRandomAdd() {
      const { list, current } = this
      const random = Math.floor(Math.random() * (list.length + 1))
      this.list = [].concat(list.slice(0, random), current, list.slice(random))
      this.current++
      console.log(list)
    },
    onRandomRemove() {
      const random = Math.floor(Math.random() * this.list.length)
      this.list.splice(random, 1)
    },
    onShuffle() {
      this.list = shuffle(this.list)
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  position: relative;
  padding: 0;

  .item {
    width: 200px
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all .5s cubic-bezier(0.55, 0, 0.1, 1);
}

// vue2 中不支持一些样式 enter-from
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(90px, 0);
}


.list-leave-active {
  position: absolute;
}
</style>
