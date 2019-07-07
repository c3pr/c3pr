<template>
  <div class="about">

    <h1>Events per Changes Committed</h1>
    <h4>Changes Committed: {{ changes_committed_uuid }}</h4>
    <h4>Project: {{ project_uuid }}</h4>

    <br><br>

    <event-list v-if="loaded" :events="getEventsForProject()"></event-list>
    <div v-else class="loading">Loading events...</div>

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
    return {
      loaded: false
    };
  },

  computed: {
    ...mapGetters(EVENTS, {getEventsForProjectByChangesCommitted: GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED})
  },

  async mounted() {
    await this.fetchEventsForProjectByChangesCommitted({project_uuid: this.project_uuid, changes_committed_uuid: this.changes_committed_uuid});
    this.loaded = true
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
