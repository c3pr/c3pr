<template>
  <div class="about">

    <h1>Logs for Service ({{ logs.length }})</h1>

    <h3>Service: {{ service }} </h3>

    <br>
    <v-layout wrap justify-space-between>
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
      <v-flex xs12 md4>
        <v-btn
          color="success"
          @click="fetchLogs"
        >GO</v-btn>
      </v-flex>
    </v-layout>
    <br>

    <table>
      <thead>
      <tr>
        <th>date_time</th>
        <th>lcid/sha/euuid</th>
        <th>service<br>name</th>
        <th>message</th>
        <th>error</th>
        <th>meta</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="log of logs" :class="log.node" :key="log._id">
        <td class="mono">
          {{ log.date_time.replace(/[TZ]/g, ' ') }}<br>
        </td>
        <td class="mono">
          {{ log.lcid.substr(0, 11) }} {{ (log.sha || '').substr(0, 11) }} {{ log.euuid.substr(0, 11) }}
        </td>
        <td>{{ log.service_name }}</td>
        <td :title="log.message" class="message" :class="log.service_name">
          {{ log.message.substr(0, 100) }}
          <v-btn v-if="log.message.length > 100" color="primary" icon small class="compact-form" @click="objetctDisplayedAtDialog = log.message"><v-icon>message</v-icon></v-btn>
        </td>
        <td>
          <span v-if="log.error"><v-btn color="error" small icon class="compact-form" @click="objetctDisplayedAtDialog = log.error"><v-icon>error</v-icon></v-btn></span>
          <span v-else>(none)</span>
        </td>
        <td><v-btn color="primary" icon small class="compact-form" @click="objetctDisplayedAtDialog = log"><v-icon>local_offer</v-icon></v-btn></td>
      </tr>
      </tbody>
    </table>

    <br>

    <v-btn color="primary" icon small @click="fetchLogs"><v-icon>refresh</v-icon></v-btn>

    <display-dialog v-model="objetctDisplayedAtDialog"></display-dialog>
  </div>
</template>

<script>
import DisplayDialog from '../components/DisplayDialog.vue';
import logsApi from '../api/logsApi';

export default {
  name: 'LogsForService',

  components: {DisplayDialog},

  data() {
    return {
      objetctDisplayedAtDialog: null,
      services: ['c3pr-hub', 'c3pr-brain', 'c3pr-dashboard', 'c3pr-repo-gitlab', 'c3pr-agent'],
      service: 'c3pr-hub',
      logs: [],
      date: this.today()
    };
  },

  computed: {
  },

  mounted() {
    this.fetchLogs();
  },

  methods: {
    async fetchLogs() {
      this.logs = await logsApi.findForService(this.service, this.date);
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
