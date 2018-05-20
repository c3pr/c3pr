<template>
  <div class="about">
    <button @click="fetchAll">{{ fetchStatus }}</button>

    <hr>

    <h1>Bus Listeners</h1>
    <table>
      <thead>
        <tr>
          <th>Event Type</th>
          <th>Module URL</th>
          <th>Callback URL</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="listener of listeners" :key="listener.event_type + listener.callbackUrl">
          <td>{{ listener.event_type }}</td>
          <td>{{ listener.callbackUrl.substring(0, listener.callbackUrl.replace("http://", "").indexOf("/") + "http://".length) }}</td>
          <td>{{ listener.callbackUrl }}</td>
        </tr>
      </tbody>
    </table>

    <hr>

    <h1>Registry</h1>
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) of registry">
          <td>{{ key }}</td>
          <td>
            <table v-if="value[0] && value[0].tool_id">
              <thead>
              <tr>
                <th>tool_id</th>
                <th>extensions</th>
                <th>tags</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="tool of value">
                <td>{{ tool.tool_id }}</td>
                <td>{{ tool.extensions }}</td>
                <td>{{ tool.tags }}</td>
              </tr>
              </tbody>
            </table>
            <span v-else>{{ value }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <hr>

    <h1>Events</h1>
    <table>
      <thead>
        <tr>
          <th>uuid</th>
          <th>event_type</th>
          <th>status</th>
          <th>processor</th>
          <th>created</th>
          <th>modified</th>
          <th>payload</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event of events" :class="event.node">
          <td>{{ event.uuid }}</td>
          <td>{{ event.event_type }}</td>
          <td>{{ event.meta.status }}</td>
          <td>{{ event.meta.processorUUID }}</td>
          <td>{{ event.meta.created }}</td>
          <td>{{ event.meta.modified }}</td>
          <td>{{ formatPayload(event.event_type, event.payload) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Logs',
  data() {
    return {
      fetchStatus: 'Click to re-fetch events',
      listeners: [],
      registry: [],
      events: [],
    };
  },
  created() { this.fetchAll(); },
  methods: {
    async fetchBusListeners() {
      const { data } = await axios.get('/api/hub/api/v1/bus/listeners');
      this.listeners = data;
    },
    async fetchRegistry() {
      const { data } = await axios.get('/api/hub/api/v1/registry');
      this.registry = data;
    },
    async fetchEvents() {
      const { data } = await axios.get('/api/hub/api/v1/events');
      data.sort((a, b) => a && a.meta && a.meta.dateTime && b && b.meta && b.meta.dateTime && a.meta.dateTime.localeCompare(b.meta.dateTime) * -1);
      this.events = data;
    },
    fetchAll() {
      this.fetchStatus = 'Fetching all...';
      Promise.all([this.fetchBusListeners(), this.fetchRegistry(), this.fetchEvents()]).then(() => {
        this.fetchStatus = 'Click to re-fetch all';
      }).catch(e => {
        // eslint-disable-next-line
        alert('Error: ' + e);
      });
    },
    formatPayload(event_type, payload) {
      switch (event_type) {
        case "ChangesCommitted": {
          return {url: payload.repository.clone_url_http, changed_files: payload.changed_files}
        }
      }
      return payload;
    },
  },
};
</script>

<style scoped>
  td, th { border: 1px solid black; border-collapse: collapse; padding: 0 5px 0 5px }
  th { background-color: #ededed }
  table { font-family: monospace; font-size: small; border-collapse: collapse; margin: auto; text-align: left; }
  pre {
    text-align: initial;
    white-space: pre-wrap;
  }
</style>
