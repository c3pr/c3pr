<template>
  <div class="about">

    <h1>Changes Committed</h1>
    <h3>For project {{ project_uuid }}</h3>

    <table>
      <thead>
      <tr>
        <th>uuid</th>
        <th>event_type</th>
        <th>status</th>
        <th>created</th>
        <th>modified</th>
        <th width="365px">message</th>
        <th title="Modified Files">Files</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event of getEventsForProject()" :class="event.node">
        <td>{{ event.uuid.split("-")[0] }}</td>
        <td>{{ event.event_type }}</td>
        <td>{{ event.meta.status }}</td>
        <td>{{ (event.meta.created || "").replace("T", " ") }}</td>
        <td>{{ (event.meta.modified || "").replace("T", " ") }}</td>
        <td :title="event.payload['source-webhook'].commits[0].message">
          {{ event.payload['source-webhook'].commits[0].message.substring(0, 50) }}{{ event.payload['source-webhook'].commits[0].message.length > 50 ? '...' : '' }}
        </td>
        <td :title="event.payload.changed_files.join('\n')">{{ event.payload.changed_files.length }}</td>
        <td :title="event.payload.repository.revision">#</td>
        <td><router-link :to= "{ name: 'events-per-project-per-changes-committed', params: { project_uuid, changes_committed_uuid: event.uuid }}">events for this commit</router-link></td>
        <td><router-link :to= "{ name: 'logs-id', params: { correlation_id: event.payload.repository.revision }}">logs</router-link></td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { EVENTS, FETCH_EVENTS_FOR_PROJECT, GET_EVENTS_BY_TYPE_FOR_PROJECT } from "../store/modules/events";
import EventDetail from '../components/EventDetail.vue';

export default {
  name: "Events",

  components: {EventDetail},

  props: {
    'project_uuid': String
  },

  data() {
    return {
      event_type: 'ChangesCommitted'
    };
  },

  computed: {
    ...mapGetters(EVENTS, {getEventsOfTypeForProject: GET_EVENTS_BY_TYPE_FOR_PROJECT})
  },

  mounted() {
    this.fetchEventsForProject({project_uuid: this.project_uuid, event_type: this.event_type});
  },

  methods: {
    getEventsForProject() {
      return this.getEventsOfTypeForProject(this.project_uuid, this.event_type)
    },
    ...mapActions(EVENTS, {fetchEventsForProject: FETCH_EVENTS_FOR_PROJECT})
  }
};
</script>

<style scoped>
</style>
