<template>
  <div id="app">
    <v-app style="background: #3c3f41; color: #bababa;">
      <div id="nav">
        <router-link to="/">Dashboard</router-link> |
        <router-link to="/projects">Projects</router-link> |
        <router-link to="/events">Events</router-link> |
        <router-link to="/hub">Hub</router-link> |
        <router-link to="/logs">Logs</router-link>
      </div>
      <router-view/>
    </v-app>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
  text-decoration: none;
}
a {
  color: #a5c261 !important;
}
.loading {
  font-weight: bold;
  animation: blinker 1.5s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
