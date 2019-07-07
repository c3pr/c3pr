<template>
  <div class="about">

    <h1>Logs for Service <span v-if="loaded">({{ logs.length }})</span></h1>

    <h3>Service: {{ service }} </h3>

    <br>
    <v-layout wrap justify-space-between style="margin: 0 20% 0 20%; border: 1px black solid">
      <v-flex xs12 md4>
      <v-select
        v-model="service"
        :items="services"
        label="Service"
        outline
      ></v-select>
      </v-flex>
      <v-flex xs12 md4>
      <v-text-field
        v-model="date"
        label="Date"
      ></v-text-field>
      </v-flex>
      <v-flex xs12 md2>
        <v-btn
          color="success"
          @click="fetchLogs"
        >GO</v-btn>
      </v-flex>
    </v-layout>
    <br>

    <v-btn v-if="loaded" color="primary" icon small @click="fetchLogs"><v-icon>refresh</v-icon></v-btn>

    <log-list v-if="loaded" :logs="logs"></log-list>
    <div v-else class="loading">Loading logs...</div>

    <br><br><br>
    <br><br><br>

  </div>
</template>

<script>
import DisplayDialog from '../components/DisplayDialog.vue';
import logsApi from '../api/logsApi';
import LogList from "../components/LogList";

export default {
  name: 'LogsForService',

  components: {DisplayDialog, LogList},

  data() {
    return {
      objetctDisplayedAtDialog: null,
      services: ['c3pr-hub', 'c3pr-brain', 'c3pr-dashboard', 'c3pr-repo-gitlab', 'c3pr-agent'],
      service: 'c3pr-hub',
      logs: [],
      date: this.today(),
      loaded: false
    };
  },

  computed: {
  },

  mounted() {
    this.fetchLogs();
  },

  methods: {
    async fetchLogs() {
      this.loaded = false;
      this.logs = await logsApi.findForService(this.service, this.date);
      if (this.service === 'c3pr-agent') {
        this.logs = this.logs.concat(await logsApi.findForService('evalmachine', this.date));
      }
      this.loaded = true;
    },

    today() {
      return new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
    }
  }

};
</script>

<style scoped>
  td, th { border: 1px solid black; border-collapse: collapse; padding: 2px }
  th { background-color: #ededed }
  table { font-family: sans-serif; font-size: small; border-collapse: collapse; margin: auto; text-align: left; }
  .message {
    text-align: left; font-family: monospace;
    color: white;
    padding: 5px
  }
  .c3pr-hub { background-color: green; }
  .c3pr-brain { background-color: cornflowerblue; }
  .c3pr-repo-gitlab { background-color: orange; }
  .c3pr-agent { background-color: gray; }
  .evalmachine { background-color: gray; }
  .mono {
    text-align: left;
    font-family: monospace;
    font-size: x-small;
  }
  pre {
    text-align: initial;
    white-space: pre-wrap;
  }
  .compact-form {
    height: 4px !important;
    transform: scale(0.5);
    transform-origin: left;
  }
</style>
