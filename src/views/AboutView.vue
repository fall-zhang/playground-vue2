<template>
  <div class="about">
    <div style="display:flex;align-items:center;justify-content:center">
      <ImageButton title="安全守则">
      </ImageButton>
    </div>
    <ScanContent :enable="enableScan" />
    <!-- <router-view></router-view> -->
    <el-button type="primary" @click="onToggleScan">{{enableScan?'关闭':'开启'}}扫描</el-button>
    <h2>详情列表：</h2>
    <MultiContent />
    <CollapseContent></CollapseContent>
  </div>
</template>
<script>
import ImageButton from '@/components/ImageButton/SvgAndContent.vue'
import ScanContent from '@/components/animate/ScanContent.vue'
import MultiContent from '@/components/animate/MultiContent.vue'
import CollapseContent from '@/components/animate/CollapseContent.vue'
export default {
  components: {
    ImageButton, ScanContent, MultiContent, CollapseContent
  },
  data() {
    return {
      enableScan: true,
      animate: true
    }
  },
  methods: {
    onToggleScan() {
      this.enableScan = !this.enableScan
    }
  }
}
</script>
<style lang="scss">

</style>