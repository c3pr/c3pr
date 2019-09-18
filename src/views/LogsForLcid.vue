<template>
  <div class="about">
    <logs-for label="LCID" :value="lcid" @refresh="reFetch" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import {LOGS, FETCH_LOGS_FOR_LCID} from "../store/modules/logs";
import LogsFor from "../components/LogsFor";

export default {
  name: 'LogsForLcid',
  components: {
      LogsFor
  },
  props: {
    lcid: {
        type: String,
        required: true
    }
  },

  mounted() {
    this.reFetch();
  },

  methods: {
    ...mapActions(LOGS, {fetchLogsForLcid: FETCH_LOGS_FOR_LCID}),

    async reFetch() {
      await this.fetchLogsForLcid(this.lcid);
    }
  }

};
</script>

<style scoped>

</style>
