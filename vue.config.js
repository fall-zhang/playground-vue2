const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 9577
  },
  // pluginOptions: {
  //   eslint: false
  // }
  runtimeCompiler: true,
  lintOnSave: false
})
