<template>
  <div class="about">
    <logs-for label="Event" :value="euuid" @refresh="reFetch" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { LOGS, FETCH_LOGS_FOR_EUUID } from "../store/modules/logs";
import LogsFor from "../components/LogsFor";

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

  mounted() {
    this.reFetch();
  },

  methods: {
    ...mapActions(LOGS, {fetchLogsForEuuid: FETCH_LOGS_FOR_EUUID}),

    async reFetch() {
      await this.fetchLogsForEuuid(this.euuid);
    }
  }

};
</script>

<style scoped>

</style>
