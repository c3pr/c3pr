<template>
  <div class="about">

    <h1>Logs for Event <span v-if="loaded">({{ getLogsForEvent.length }})</span></h1>

    <h3>Event: {{ euuid }} </h3>

    <br>

    <v-btn v-if="loaded" color="primary" icon small @click="reFetch"><v-icon>refresh</v-icon></v-btn>

    <log-list v-if="loaded" :logs="getLogsForEvent"></log-list>
    <div v-else class="loading">Loading logs...</div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { LOGS, FETCH_LOGS_FOR_EVENT, GET_LOGS_FOR_EVENT } from "../store/modules/logs";
import DisplayDialog from '../components/DisplayDialog.vue';
import LogList from "../components/LogList";

export default {
  name: 'LogsForEvent',

  components: {LogList},

  props: {
    'euuid': String
  },

  data() {
    return {
      loaded: false
    };
  },

  computed: {
    ...mapGetters(LOGS, {getLogsForEvent: GET_LOGS_FOR_EVENT})
  },

  mounted() {
    this.reFetch();
  },

  methods: {
    ...mapActions(LOGS, {fetchLogsForEvent: FETCH_LOGS_FOR_EVENT}),

    async reFetch() {
      this.loaded = false;
      await this.fetchLogsForEvent(this.euuid);
      this.loaded = true;
    }
  }

};
</script>

<style scoped>
  table { font-family: sans-serif; font-size: small; border-collapse: collapse; margin: auto; text-align: left; }
  pre {
    text-align: initial;
    white-space: pre-wrap;
  }
</style>
