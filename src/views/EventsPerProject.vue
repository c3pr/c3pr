<template>
  <div class="about">

    <h1>Events ({{ events.length }})!</h1>

    <table>
      <thead>
      <tr>
        <th>uuid</th>
        <th>event_type</th>
        <th>status</th>
        <th>created</th>
        <th>modified</th>
        <th>payload</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event of events" :class="event.node" v-if="false">
        <td>{{ event.uuid.split("-")[0] }}</td>
        <td>{{ event.event_type }}</td>
        <td>{{ event.meta.status }}</td>
        <td>{{ (event.meta.created || "").replace("T", " ") }}</td>
        <td>{{ (event.meta.modified || "").replace("T", " ") }}</td>
        <td>{{ (projects.find(p => p.uuid === event.payload.project_uuid) || {}).name }}</td>
        <td :title="event.payload.changed_files.join('\n')">{{ event.payload.changed_files.length }}</td>
        <td><router-link :to= "{ name: 'details', params: { projectId: event._id, project: event }}">details</router-link></td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  EVENTS,
  FETCH_ALL_EVENTS,
  FETCH_CHANGES_COMMITTED_PER_PROJECT,
  GET_ALL_EVENTS,
  GET_CHANGES_COMMITTED_PER_PROJECT
} from "../store/modules/events";
import { PROJECTS, FETCH_ALL_PROJECTS, GET_ALL_PROJECTS } from "../store/modules/projects";
import EventDetail from '../components/EventDetail.vue';

export default {
  name: "Events",

  components: {EventDetail},

  data() {
    return {};
  },

  computed: {
    ...mapGetters(EVENTS, {events: GET_ALL_EVENTS, changesCommittedPerProject: GET_CHANGES_COMMITTED_PER_PROJECT}),
    ...mapGetters(PROJECTS, {projects: GET_ALL_PROJECTS})
  },

  created() {
    this.fetchEvents();
    this.fetchChangesCommittedPerProject();
    this.fetchProjects();
  },

  methods: {
    ...mapActions(EVENTS, {fetchEvents: FETCH_ALL_EVENTS, fetchChangesCommittedPerProject: FETCH_CHANGES_COMMITTED_PER_PROJECT}),
    ...mapActions(PROJECTS, {fetchProjects: FETCH_ALL_PROJECTS})
  }
};
</script>

<style scoped>
table.project-table td,
table.project-table th {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 2px;
}

th {
  background-color: #ededed;
}

table.project-table {
  font-family: sans-serif;
  font-size: small;
  border-collapse: collapse;
  margin: auto;
  text-align: left;
}

.message {
  text-align: left;
  font-family: monospace;
}

.c3pr-repo-github {
  color: purple;
}

.c3pr {
  color: blue;
}

.c3pr-agent {
  color: green;
}

pre {
  text-align: initial;
  white-space: pre-wrap;
}
</style>
