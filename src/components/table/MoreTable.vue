<template>
  <div>
    <el-table @selection-change="handleSelectionChange" :height="mainTabHeight"
      :default-sort="{ prop: 'updateTime', order: 'descending' }" show-overflow-tooltip stripe :data="pageData" border
      style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column sortable prop="name" label="名称" width="300">
      </el-table-column>
      <el-table-column sortable label="描述" width="400">
        <template slot-scope="scope">
          {{ scope.row.description ? scope.row.description : '无描述信息' }}
        </template>
      </el-table-column>
      <el-table-column sortable label="是否展示页头" width="150">
        <template slot-scope="scope">
          {{ scope.row.showHeader ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column sortable label="是否展示页尾" width="150">
        <template slot-scope="scope">
          {{ scope.row.showFooter ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间" width="200">
      </el-table-column>
      <el-table-column sortable prop="updateTime" label="更新时间" width="200">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <div style="display: flex; gap: 10px">
            <el-link @click="editHandler(scope.row.id)" type="text" size="small">编辑</el-link>
            <el-link @click="deleteHandler(scope.row.id)" type="text" size="small">删除</el-link>
            <el-link @click="copyHandler(scope.row.id)" type="text" size="small">复制</el-link>
            <el-link @click="previewHandler(scope.row.id, scope.row.layoutModel)" type="text" size="small">预览</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  methods: {
    searchData() {
      if (this.search !== null && this.search !== '') {
        this.filterData.data = [{ field: 'name', opt: 1, value: this.search, link: 0, sort: 0 }];
        this.refreshPage()
      }
      else {
        this.filterData.data = null;
        this.refreshPage();
      }
    },
    refreshPage: function () {
      let data = {
        start: this.currentPage,
        size: this.pageSize,
        conditions: this.filterData.data,
      };
      if (!data.conditions) {
        data.conditions = [];
      }
      data.conditions.push({ field: 'updateTime', sort: 2, opt: -1, value: null, link: 1 });
      apis.application.getApplicationConditionEnhancePage(data)
        .then(res => {
          if (res.status === 200) {
            ({ pageElements: this.pageData, totalElements: this.totalSize } = res.data);
          }
        })
        .catch(reason => {
          const { notes, errorInfo } = reason.response.data;
          this.$message.error(errorInfo + '[' + notes + ']');
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.refreshPage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshPage();
    },
    editHandler(id) {
      if (typeof (id) !== 'undefined') {
        this.$router.push("application-module/" + id);
      }
      else {
        this.$router.push('/application-module');
      }
    },
    confirmFilter() {
      this.refreshPage();
    },
    previewHandler(id, layoutModel) {
      let { href } = this.$router.resolve({ path: 'application-instance/' + layoutModel + '/' + id });
      window.open(href, '_blank');
    },
    copyHandler(id) {
      this.$confirm('是否确认复制？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          apis.application.copyApplication([id])
            .then(res => {
              if (res.status === 200) {
                this.$message.success("复制应用集成成功");
                this.refreshPage();
              }
            });
        });
    },
    deleteBatchHandler() {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          apis.application.delApplication(this.selectedData.map(item => item.id)
            .join(","))
            .then(res => {
              if (res.status === 200) {
                this.$message.success("删除应用成功");
                this.refreshPage();
              }
            })
            .catch(reason => {
              const { errorInfo } = reason;
              this.$message.error('删除应用失败' + errorInfo);
            });
        });
    },
    deleteHandler(id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          apis.application.delApplication(id)
            .then(res => {
              if (res.status === 200) {
                this.$message.success("删除应用成功");
                this.refreshPage();
              }
            })
            .catch(reason => {
              const { errorInfo } = reason;
              this.$message.error('删除应用失败' + errorInfo);
            });
        });
    },
    switchShowType(style) {
      this.showStyle = style;
    },
    handleSelectionChange(val) {
      this.selectedData = val;
    },
    exportRtSetting() { },
    exportSetting() {
      apis.application.exportSettingData({
        content: this.selectedData.map(item => item.id)
          .join(",")
      })
        .then(res => {
          if (res.status === 200) {
            zipUtils.downRecord("应用集成.oad", res.data);
          }
        });
    },
    importSetting(file, fileList) {
      if (fileList.length > 0) {
        zipUtils.unzipFile(file.raw, /\.(oad)$/)
          .then(res => {
            apis.application.importSettingData({ content: res })
              .then(res => {
                if (res.status === 200) {
                  this.$message.success("导入配置文件成功");
                  this.refreshPage();
                }
              })
              .catch(reason => {
                const { notes, errorInfo } = reason.response.data;
                this.$message.error(errorInfo + '[' + notes + ']');
              });
          });
      }
    }
  },
  data() {
    return {
      selectedData: [],
      showStyle: 'tab',
      imgMap: {
        filling: '../../../static/img/filling.jpeg',
        report: '../../../static/img/report.jpeg',
        flow: '../../../static/img/flow.jpeg',
        form: '../../../static/img/form.jpeg',

      },
      pageData: [],
      currentPage: 1,
      pageSize: 10,
      totalSize: null,
      filterData: {
        condition: null,
        operation: null,
        relation: null,
        sort: null,
      },
      filerColumn: {
        name: { alias: '名称', type: 'input', filterShow: true },
        description: { alias: '描述', type: 'input', filterShow: true },
      },
      search: null,
      mainTabHeight: 800
    };
  },
  created() { },
  mounted() {
    // this.mainTabHeight = this.$refs.mainTab.$el.clientHeight - 40
  },
}
</script>

<style scoped lang="scss">

</style>
