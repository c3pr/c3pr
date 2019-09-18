<template>
  <div class="about">
    <logs-for label="Event" :value="euuid" @refresh="reFetch" />

    <br><br>

    <v-btn @click="markEventAsUnprocessed">MARK EVENT AS UNPROCESSED</v-btn>
    <br>
    <span v-if="markingEventAsUnprocessed">Marking as unprocessed...</span>
    <br>
    {{ ev }}
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { LOGS, FETCH_LOGS_FOR_EUUID } from "../store/modules/logs";
import LogsFor from "../components/LogsFor";
import eventsApi from "../api/eventsApi";

export default {
  name: 'LogsForEuuid',
  components: {
      LogsFor
  },
  props: {
    euuid: {
        type: String,
        required: true
    }
  },

  data() {
    return {
      markingEventAsUnprocessed: false,
      ev: null
    }
  },

  mounted() {
    this.reFetch();
  },

  methods: {
    ...mapActions(LOGS, {fetchLogsForEuuid: FETCH_LOGS_FOR_EUUID}),

    async reFetch() {
      await this.fetchLogsForEuuid(this.euuid);
    },

    async markEventAsUnprocessed() {
      this.markingEventAsUnprocessed = true;
      await eventsApi.markEventAsUnprocessed(this.euuid);
      this.markingEventAsUnprocessed = false;
      eventsApi.findEventByUuid(this.euuid).then(r => r.data).then(() => this.ev = data);
    }
  }

};
</script>

<style scoped>

</style>
