<template>
  <div class="about">
    <button @click="fetchAll">{{ fetchStatus }}</button>

    <button @click="displayedMeta = {}">clear displayedMeta</button>
    <pre>
      {{ displayedMeta }}
    </pre>
    <hr>
    <div>
    <span v-for="prop of Object.keys(display)" :key="prop">
      <input type="checkbox" v-model="display[prop]">{{ prop }}
    </span>
    </div>
    <table>
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
        });
    },
    unique(a) {
      return a.filter((item, pos) => a.indexOf(item) === pos);
    },
  },
};
</script>

<style scoped>
  td { border: 1px solid black; border-collapse: collapse; }
  table { font-family: sans-serif; font-size: small; }
  .message { text-align: left; font-family: monospace; }
  .c3pr-repo-github { color: purple; }
  .c3pr { color: blue; }
  .c3pr-agent { color: green; }
  pre {
    text-align: initial;
    white-space: pre-wrap;
  }
</style>
