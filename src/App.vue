<template>
  <div id="app">
    <nav>
      <router-link to="/">Graph应用</router-link> |
      <router-link to="/animate">动画应用</router-link> |
      <router-link to="/other">其它应用</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

nav {
  padding: 20px;
  text-align: center;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
