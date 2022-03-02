<template>
  <div class="about">
    <logs-for label="SHA" :value="sha" @refresh="reFetch" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import {LOGS, FETCH_LOGS_FOR_SHA} from "../store/modules/logs";
import LogsFor from "../components/LogsFor";

export default {
  name: 'LogsForSha',
  components: {
      LogsFor
  },
  props: {
    sha: {
        type: String,
        required: true
    }
  },

  mounted() {
    this.reFetch();
  },

  methods: {
    ...mapActions(LOGS, {fetchLogsForSha: FETCH_LOGS_FOR_SHA}),

    async reFetch() {
      await this.fetchLogsForSha(this.sha);
    }
  }

};
</script>

<style scoped>

</style>
