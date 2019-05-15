<template>
  <div class="about">
    <button @click="fetchAll">{{ fetchStatus }}</button>

    <hr>

    <h1>Bus Listeners ({{ listeners.length }})</h1>
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

    <h1>Tool Agents Registry ({{ Object.keys(registry).length }})</h1>
    <table>
      <thead>
        <tr>
          <th>tool_id</th>
          <th>extensions</th>
          <th>tags</th>
          <th>agent_id</th>
          <th>expiration_time</th>
          <th>last_updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="agent of registry">
          <td>{{ agent.tool_id }}</td>
          <td>{{ agent.extensions }}</td>
          <td>{{ agent.tags }}</td>
          <td>{{ agent.agent_id }}</td>
          <td :title="agent.expiration_time">{{ ago(agent.expiration_time) }}</td>
          <td :title="agent.last_updated">{{ ago(agent.last_updated) }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import axios from 'axios';
import EventDetail from '../components/EventDetail.vue';
import moment from 'moment';
import {BACKEND_HUB} from "../envs";

export default {
  name: 'Hub',
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
      const { data } = await axios.get(BACKEND_HUB + '/api/v1/bus/listeners');
      this.listeners = data;
    },
    async fetchRegistry() {
      const { data } = await axios.get(BACKEND_HUB + '/api/v1/agents');
      this.registry = data;
    },
    async fetchEvents() {
      const {data} = await axios.get(BACKEND_HUB + '/api/v1/events');
      if (Array.isArray(data)) {
        data.sort((a, b) => {
          return a && a.meta && a.meta.created && b && b.meta && b.meta.created && a.meta.created.localeCompare(b.meta.created) * -1;
        });
        this.events = data;
      } else {
        this.events = [];
        throw new Error(data);
      }
    },
    fetchAll() {
      this.fetchStatus = 'Fetching all...';
      Promise.all([this.fetchBusListeners(), this.fetchRegistry(), this.fetchEvents()]).then(() => {
        this.fetchStatus = 'Click to re-fetch all';
      }).catch(e => {
        // eslint-disable-next-line
        alert('Error: ' + e + '\n\nNote: if the error is 401, you probably restarted the HUB but didn\'t restart the dashboard after.');
      });
    },
    ago(date) {
      return moment(date).fromNow();
    }
  },
  components: {EventDetail}
};
</script>

<style>
  td, th { border: 1px solid black; border-collapse: collapse; padding: 0 5px 0 5px }
  th, .grayed { background-color: #ededed; font-weight: bold; }
  table { font-family: monospace; font-size: small; border-collapse: collapse; margin: auto; text-align: left; }
  pre {
    text-align: initial;
    white-space: pre-wrap;
  }
</style>
