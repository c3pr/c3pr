<template>
  <div class="about">
    <button @click="fetchAll">{{ fetchStatus }}</button>

    <button @click="displayedMeta = {}" :disabled="Object.keys(displayedMeta).length === 0">
      clear displayedMeta
    </button>
    <pre>{{ (JSON.stringify(displayedMeta || "", null, 2)).replace(/([^\\])\\n/g, "$1\n") }}</pre>
    <hr>
    <div>
    <span v-for="prop of Object.keys(display)" :key="prop">
      <input type="checkbox" v-model="display[prop]">{{ prop }}
    </span>
    </div>
    <table>
      <thead>
      <tr>
        <th v-if="display._id">_ID</th>
        <th v-if="display.node">NODE</th>
        <th v-if="display.dateTime">DATETIME</th>
        <th v-if="display.correlationIds">CORRELATIONIDS</th>
        <th v-if="display.moduleNames">MODULENAMES</th>
        <th v-if="display.message">MESSAGE</th>
        <th v-if="display.meta">META</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="log of logs" :class="log.node" :key="log._id">
        <td v-if="display._id">{{ log._id }}</td>
        <td v-if="display.node">{{ log.node }}</td>
        <td v-if="display.dateTime">{{ log.dateTime }}</td>
        <td v-if="display.correlationIds">{{ unique(log.correlationIds) }}</td>
        <td v-if="display.moduleNames">{{ log.moduleNames }}</td>
        <td v-if="display.message" :title="log.message" class="message" style="cursor: pointer"
          @click="displayedMeta = log.metadata">
          {{ log.message.substr(0, 100) }}
        </td>
        <td v-if="display.meta">{{ log.metadata }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Logs',
  data() {
    return {
      fetchStatus: 'Click to re-fetch logs',
      logs: [],
      displayedMeta: {},
      display: {
        _id: false,
        node: true,
        dateTime: true,
        correlationIds: true,
        moduleNames: true,
        message: true,
        meta: false,
      },
    };
  },
  created() { this.fetchAll(); },
  methods: {
    fetchAll() {
      this.fetchStatus = 'Fetching logs...';
      fetch('/api/v1/logs')
        .then(r => r.json())
        .then((r) => {
          r.sort((a, b) => a.dateTime.localeCompare(b.dateTime) * -1);
          this.logs = r;
          this.fetchStatus = 'Click to re-fetch logs';
        }).catch((e) => {
          // eslint-disable-next-line
          alert('Error: ' + e);
        });
    },
    unique(a) {
      return a.filter((item, pos) => a.indexOf(item) === pos);
    },
  },
};
</script>

<style scoped>
  td, th { border: 1px solid black; border-collapse: collapse; padding: 2px }
  th { background-color: #ededed }
  table { font-family: sans-serif; font-size: small; border-collapse: collapse; margin: auto; text-align: left; }
  .message { text-align: left; font-family: monospace; }
  .c3pr-repo-github { color: purple; }
  .c3pr { color: blue; }
  .c3pr-agent { color: green; }
  pre {
    text-align: initial;
    white-space: pre-wrap;
  }
</style>
