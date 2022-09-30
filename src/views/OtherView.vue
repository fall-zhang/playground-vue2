<template>
  <div class="other">
    <MoreTable />
  </div>
</template>

<script>
import MoreTable from '@/components/table/MoreTable.vue'
export default {
  name: 'HomeView',
  components: { MoreTable },
  mounted() {
    console.log(this.$route)
  }
}
</script>
