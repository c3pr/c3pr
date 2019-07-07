<template>
  <div class="about">

    <h1>Changes Committed</h1>
    <h3>For project {{ project_uuid }}</h3>

    <br>

    <table v-if="loaded">
      <thead>
      <tr>
        <th>sha</th>
        <th>status</th>
        <th>created</th>
        <th>modified</th>
        <th width="365px">message</th>
        <th title="Modified Files">Files</th>
        <th>Events</th>
        <th>Logs</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event of getEventsForProject()" :class="event.node">
        <td>{{ sha(event) }}</td>
        <td>{{ status(event) }}</td>
        <td>{{ (event.meta.created || "").replace("T", " ") }}</td>
        <td>{{ (event.meta.modified || "").replace("T", " ") }}</td>
        <td :title="event.payload['source-webhook'].commits[0].message">
          {{ event.payload['source-webhook'].commits[0].message.substring(0, 50) }}{{ event.payload['source-webhook'].commits[0].message.length > 50 ? '...' : '' }}
        </td>
        <td :title="event.payload.changed_files.join('\n')">{{ event.payload.changed_files.length }}</td>
        <td><router-link :to= "{ name: 'events-per-project-per-changes-committed', params: { project_uuid, changes_committed_uuid: event.uuid }}">events for this commit</router-link></td>
        <td><router-link :to= "{ name: 'logs-euuid', params: { euuid: event.uuid }}">logs</router-link></td>
      </tr>
      </tbody>
    </table>
    <div v-else class="loading">Loading events...</div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { EVENTS, FETCH_EVENTS_FOR_PROJECT, GET_EVENTS_BY_TYPE_FOR_PROJECT } from "../store/modules/events";
import {sha, status} from "../app/events";

export default {
  name: "Events",

  components: {},

  props: {
    'project_uuid': String
  },

  data() {
    return {
      event_type: 'ChangesCommitted',
      loaded: false
    };
  },

  computed: {
    ...mapGetters(EVENTS, {getEventsOfTypeForProject: GET_EVENTS_BY_TYPE_FOR_PROJECT})
  },

  async mounted() {
    await this.fetchEventsForProject({project_uuid: this.project_uuid, event_type: this.event_type});
    this.loaded = true;
  },

  methods: {
    getEventsForProject() {
      return this.getEventsOfTypeForProject(this.project_uuid, this.event_type)
    },
    ...mapActions(EVENTS, {fetchEventsForProject: FETCH_EVENTS_FOR_PROJECT}),
    sha,
    status
  }
};
</script>

<style scoped>
  td, th { border: 1px solid black; border-collapse: collapse; padding: 0 5px 0 5px }
  th { background-color: #ededed; font-weight: bold; }
  table { font-family: monospace; font-size: small; border-collapse: collapse; margin: auto; text-align: left; }
</style>
