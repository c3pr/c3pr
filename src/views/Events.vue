<template>
  <div class="about">

    <h1>Committed Changes per Project</h1>

    <table>
      <thead>
      <tr>
        <th>Project Name</th>
        <th>Committed Changes</th>
        <th>Last modification</th>
        <th>Details</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="ccpp of changesCommittedPerProject">
        <td>{{ (projects.find(p => p.uuid === ccpp._id.project_uuid) || {}).name }}</td>
        <td>{{ ccpp.count }}</td>
        <td>{{ ccpp.last_modified }}</td>
        <td>
          <router-link :to="{ name: 'events-per-project', params: { project_uuid: ccpp._id.project_uuid }}">all events</router-link>
        </td>
      </tr>
      </tbody>
    </table>

    <br>

    <h1>Unprocessed/Processing Events</h1>

    <table>
      <thead>
      <tr>
        <th>uuid</th>
        <th>event_type</th>
        <th>status</th>
        <th>created</th>
        <th>modified</th>
        <th>Logs</th>
        <th>Details</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event of eventsUnprocessedAndProcessing">
        <td>{{ event.uuid.split("-")[0] }}</td>
        <td>{{ event.event_type }}</td>
        <td>{{ event.meta.status }}</td>
        <td>{{ (event.meta.created || "").replace("T", " ") }}</td>
        <td>{{ (event.meta.modified || "").replace("T", " ") }}</td>
        <td><router-link :to= "{ name: 'logs-euuid', params: { euuid: event.uuid }}">logs</router-link></td>
        <td><v-btn color="primary" small @click="displayAtDialog(event)"><v-icon>local_offer</v-icon>Details</v-btn></td>
      </tr>
      </tbody>
    </table>



    <div class="text-xs-center">
      <v-dialog v-model="displayDialog">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Event Details</v-card-title>
          <v-card-text>
            <pre style="font-size: x-small">{{ formattedObjetctDisplayedAtDialog }}</pre>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="displayDialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {
    EVENTS,
    FETCH_CHANGES_COMMITTED_PER_PROJECT, FETCH_EVENTS_UNPROCESSED_AND_PROCESSING,
    GET_CHANGES_COMMITTED_PER_PROJECT, GET_EVENTS_UNPROCESSED_AND_PROCESSING
  } from "../store/modules/events";
  import {PROJECTS, FETCH_ALL_PROJECTS, GET_ALL_PROJECTS} from "../store/modules/projects";
  import EventDetail from '../components/EventDetail.vue';

  export default {
    name: "Events",

    components: {EventDetail},

    data() {
      return {
        objetctDisplayedAtDialog: null,
        displayDialog: false
      };
    },

    computed: {
      ...mapGetters(EVENTS, {
        changesCommittedPerProject: GET_CHANGES_COMMITTED_PER_PROJECT,
        eventsUnprocessedAndProcessing: GET_EVENTS_UNPROCESSED_AND_PROCESSING,
      }),
      ...mapGetters(PROJECTS, {projects: GET_ALL_PROJECTS}),

      formattedObjetctDisplayedAtDialog() {
        const objectAsString = JSON.stringify(this.objetctDisplayedAtDialog || "", null, 2);
        const withLineBreaks = (objectAsString).replace(/([^\\])(?:\\r)?\\n/g, "$1\n");
        return withLineBreaks.replace(/([^\\])\\t/g, "$1\t");
      }
    },

    created() {
      this.fetchChangesCommittedPerProject();
      this.fetchProjects();
      this.fetchEventsUnprocessedAndProcessing();
    },

    methods: {
      ...mapActions(EVENTS, {
        fetchChangesCommittedPerProject: FETCH_CHANGES_COMMITTED_PER_PROJECT,
        fetchEventsUnprocessedAndProcessing: FETCH_EVENTS_UNPROCESSED_AND_PROCESSING
      }),
      ...mapActions(PROJECTS, {fetchProjects: FETCH_ALL_PROJECTS}),

      displayAtDialog(obj) {
        this.objetctDisplayedAtDialog = obj;
        this.displayDialog = true;
      },
    }
  };
</script>

<style scoped>
</style>
