<template>
  <div class="about">
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
        <tr v-for="(key, value) of registry" :key="key">
          <td>{{ key }}</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </table>
    <hr>

    <button @click="fetchEvents">{{ fetchStatus }}</button>

    <hr>

    <h1>Events</h1>
    <div>
    <span v-for="prop of Object.keys(display)" :key="prop">
      <input type="checkbox" v-model="display[prop]">{{ prop }}
    </span>
    </div>
    <table>
      <tr v-for="event of events" :class="event.node" :key="event._id">
        <td v-if="display._id">{{ event._id }}</td>
        <td v-if="display.uuid">{{ event.uuid }}</td>
        <td v-if="display.event_type">{{ event.event_type }}</td>
        <td v-if="display.meta.status">{{ event.meta.status }}</td>
        <td v-if="display.meta.processor">{{ event.meta.processor }}</td>
        <td v-if="display.meta.dateTime">{{ event.meta.dateTime }}</td>
        <td v-if="display.payload">{{ event.payload }}</td>
      </tr>
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
      events: [],
      display: {
        _id: false,
        uuid: true,
        event_type: true,
        meta: {status: true, processor: true, dateTime: true},
        payload: true,
      },
      listeners: [],
      registry: []
    };
  },
  created() { this.fetchAll(); },
  methods: {
    async fetchBusListeners() {
      let {data} = await axios.get('/api/hub/api/v1/bus/listeners');
      this.listeners = data;
    },
    async fetchRegistry() {
      let {data} = await axios.get('/api/hub/api/v1/registry');
      this.registry = data;
    },
    async fetchEvents() {
      this.fetchStatus = 'Fetching Events...';
      try {
        let {data} = await axios.get('/api/hub/api/v1/events');
        data.sort((a, b) => a.meta.dateTime.localeCompare(b.meta.dateTime) * -1);
        this.events = data;
        this.fetchStatus = 'Click to re-fetch events';
      } catch(e) {
          // eslint-disable-next-line
          alert('Error: ' + e);
      }
    },
    fetchAll() {
      this.fetchBusListeners();
      this.fetchRegistry();
      this.fetchEvents();
    }
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
