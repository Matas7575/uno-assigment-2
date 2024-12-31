<template>
  <div id="app">
    <header>
      <h1>Uno Game</h1>
    </header>

    <!-- Main content area where different views will be displayed -->
    <router-view></router-view>
  </div>
</template>

<script setup></script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 20px;
}

header {
  background-color: #f5f5f5;
  padding: 10px;
  border-bottom: 2px solid #e0e0e0;
}

h1 {
  color: #333;
}
</style>
