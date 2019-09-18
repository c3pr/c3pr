<template>
  <div class="about">
    <logs-for label="Event" :value="euuid" @refresh="reFetch" />

    <br><br>

    <v-btn @click="markEventAsUnprocessed">MARK EVENT AS UNPROCESSED</v-btn>
    <br>
    <span v-if="markingEventAsUnprocessed">Marking as unprocessed...</span>
    <br>
    <span v-if="ev && ev.payload.parent && ev.payload.parent.uuid">
      <router-link :to= "{ name: 'logs-euuid', params: { euuid: ev.payload.parent.uuid }}">GO TO PARENT EVENT LOGS - {{ ev.payload.parent.uuid }}</router-link>
    </span>
    <br>
    <pre style="text-align: left; margin: 10px">{{ ev }}</pre>
    <br><br>
    <pre v-if="ev && ev.payload.diff_base64" style="text-align: left; margin: 10px; color: greenyellow">{{ fromBase64(ev.payload.diff_base64) }}</pre>

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
      this.ev = await eventsApi.findEventByUuid(this.euuid);
    },

    async markEventAsUnprocessed() {
      this.markingEventAsUnprocessed = true;
      await eventsApi.markEventAsUnprocessed(this.euuid);
      this.markingEventAsUnprocessed = false;
      this.reFetch();
    },

    fromBase64(x) {
      return atob(x);
    }
  }

};
</script>

<style scoped>

</style>
