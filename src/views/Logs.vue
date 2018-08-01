<template>
  <div class="about">

    <h1>Logs for Event ({{ getLogsForEvent.length }})</h1>

    <h3>Event: {{ euuid }} </h3>

    <br>

    <table>
      <thead>
      <tr>
        <th>date_time/lcid/euuid</th>
        <th>service<br>name</th>
        <th>caller<br>name</th>
        <th>message</th>
        <th>error</th>
        <th>meta</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="log of getLogsForEvent" :class="log.node" :key="log._id">
        <td class="mono">
          {{ log.date_time.replace(/[TZ]/g, ' ') }}<br>
          {{ log.lcid.substr(0, 11) }} {{ log.euuid.substr(0, 11) }}
        </td>
        <td>{{ log.service_name }}</td>
        <td style="font-size: x-small">{{ log.caller_name }}</td>
        <td :title="log.message" class="message">
          {{ log.message.substr(0, 70) }}
          <v-btn v-if="log.message.length > 70" color="primary" icon small @click="displayAtDialog(log.message)"><v-icon>message</v-icon></v-btn>
        </td>
        <td>
          <span v-if="log.error"><v-btn color="error" small icon @click="displayAtDialog(log.error)"><v-icon>error</v-icon></v-btn></span>
          <span v-else>(none)</span>
        </td>
        <td><v-btn color="primary" icon small @click="displayAtDialog(log.metadata)"><v-icon>local_offer</v-icon></v-btn></td>
      </tr>
      </tbody>
    </table>

    <br>

    <v-btn color="primary" icon small @click="reFetch"><v-icon>refresh</v-icon></v-btn>

    <div class="text-xs-center">
      <v-dialog v-model="displayDialog">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Log Details</v-card-title>
          <v-card-text>
            <pre style="font-size: x-small">{{ formattedObjetctDisplayedAtDialog }}</pre>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="displayDialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { LOGS, FETCH_LOGS_FOR_EVENT, GET_LOGS_FOR_EVENT } from "../store/modules/logs";

export default {
  name: 'Logs',

  props: {
    'euuid': String
  },

  data() {
    return {
      displayDialog: false,
      objetctDisplayedAtDialog: null
    };
  },

  computed: {
    ...mapGetters(LOGS, {getLogsForEvent: GET_LOGS_FOR_EVENT}),

    formattedObjetctDisplayedAtDialog() {
      const objectAsString = JSON.stringify(this.objetctDisplayedAtDialog || "", null, 2);
      const withLineBreaks = (objectAsString).replace(/([^\\])(?:\\r)?\\n/g, "$1\n");
      return withLineBreaks.replace(/([^\\])\\t/g, "$1\t");
    }
  },

  mounted() {
    this.reFetch();
  },

  methods: {
    displayAtDialog(obj) {
      this.objetctDisplayedAtDialog = obj;
      this.displayDialog = true;
    },

    ...mapActions(LOGS, {fetchLogsForEvent: FETCH_LOGS_FOR_EVENT}),

    reFetch() {
      this.fetchLogsForEvent(this.euuid);
    }
  }

};
</script>

<style scoped>
  td, th { border: 1px solid black; border-collapse: collapse; padding: 2px }
  th { background-color: #ededed }
  table { font-family: sans-serif; font-size: small; border-collapse: collapse; margin: auto; text-align: left; }
  .message {
    text-align: left; font-family: monospace; font-size: large;
    background-color: gray;
    color: white;
    padding: 5px
  }
  .mono {
    text-align: left;
    font-family: monospace;
    font-size: x-small;
  }
  pre {
    text-align: initial;
    white-space: pre-wrap;
  }
</style>
