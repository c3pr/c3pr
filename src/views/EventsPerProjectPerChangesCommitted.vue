<template>
  <div class="about">

    <h1>Events per Changes Committed</h1>
    <h4>Changes Committed: {{ changes_committed_uuid }}</h4>
    <h4>Project: {{ project_uuid }}</h4>

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
      <tr v-for="event of getEventsForProject()" :class="event.node">
        <td>{{ event.uuid.split("-")[0] }}</td>
        <td>{{ event.event_type }}</td>
        <td>{{ event.meta.status }}</td>
        <td>{{ (event.meta.created || "").replace("T", " ") }}</td>
        <td>{{ (event.meta.modified || "").replace("T", " ") }}</td>

        <td><router-link :to= "{ name: 'project-details', params: { projectId: event._id, project: event }}">details</router-link></td>
        <td><router-link :to= "{ name: 'logs-euuid', params: { euuid: event.uuid }}">logs</router-link></td>
      </tr>
      </tbody>
    </table>

    <hr>

    <event-list :events="getEventsForProject()"></event-list>

  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {
    EVENTS,
    FETCH_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED,
    GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED
  } from "../store/modules/events";
  import EventDetail from '../components/EventDetail.vue';
  import EventList from "../components/EventList";

  export default {
  name: "EventsPerProjectPerChangesCommitted",

  components: {EventDetail, EventList},

  props: {
    'project_uuid': String,
    'changes_committed_uuid': String
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters(EVENTS, {getEventsForProjectByChangesCommitted: GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED})
  },

  mounted() {
    this.fetchEventsForProjectByChangesCommitted({project_uuid: this.project_uuid, changes_committed_uuid: this.changes_committed_uuid});
  },

  methods: {
    getEventsForProject() {
      return this.getEventsForProjectByChangesCommitted(this.project_uuid, this.changes_committed_uuid)
    },
    ...mapActions(EVENTS, {fetchEventsForProjectByChangesCommitted: FETCH_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED})
  }
};
</script>

<style scoped>
</style>
