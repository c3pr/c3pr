<template>
  <div id="app">
    <v-app dark style="color: #bababa;">
      <div id="nav">
        <router-link to="/">Dashboard</router-link> |
        <router-link to="/projects">Projects</router-link> |
        <router-link to="/events">Events</router-link> |
        <router-link to="/hub">Hub</router-link> |
        <router-link to="/logs">Logs</router-link>
      </div>
      <router-view/>
      <br><br><br>
    </v-app>
  </div>
</template>

<style>
html, body, #app { height: 100%; background-color: #3c3f41; }
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
  text-decoration: none;
}
a:hover {
  color: #cc7832 !important;
  text-decoration: underline;
}

td, th { border: 1px solid #808080; border-collapse: collapse; padding: 0 5px 0 5px; }
tr:hover {
  background-color: #000000;
}
th { background-color: #2a4847; color: #e8bf6a; font-weight: bold; }
table { font-family: monospace; font-size: small; border-collapse: collapse; margin: auto; text-align: left; }

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
