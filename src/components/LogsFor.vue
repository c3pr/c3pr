<template>
  <div class="about">

    <h1>Logs for {{ label }} <span v-if="loaded">({{ logs.length }})</span></h1>

    <h3>{{ label }}: {{ value }} </h3>

    <br>

    <v-btn v-if="loaded" color="primary" icon small @click="$emit('refresh')"><v-icon>refresh</v-icon></v-btn>

    <br>
    <br>

    <log-list v-if="loaded" :logs="logs"></log-list>
    <div v-else class="loading">Loading logs...</div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { LOGS, GET_LOGS } from "../store/modules/logs";
import LogList from "../components/LogList";

export default {
  name: 'LogsFor',

  components: {LogList},

  props: {
    label: String,
    value: String
  },

  computed: {
    ...mapGetters(LOGS, {logs: GET_LOGS}),
    loaded() { return this.logs && this.logs.length }
  },
};
</script>

<style scoped>
  table { font-family: sans-serif; font-size: small; border-collapse: collapse; margin: auto; text-align: left; }
  pre {
    text-align: initial;
    white-space: pre-wrap;
  }
</style>
