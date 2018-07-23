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

  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {
    EVENTS,
    FETCH_CHANGES_COMMITTED_PER_PROJECT,
    GET_CHANGES_COMMITTED_PER_PROJECT
  } from "../store/modules/events";
  import {PROJECTS, FETCH_ALL_PROJECTS, GET_ALL_PROJECTS} from "../store/modules/projects";
  import EventDetail from '../components/EventDetail.vue';

  export default {
    name: "Events",

    components: {EventDetail},

    data() {
      return {};
    },

    computed: {
      ...mapGetters(EVENTS, {changesCommittedPerProject: GET_CHANGES_COMMITTED_PER_PROJECT}),
      ...mapGetters(PROJECTS, {projects: GET_ALL_PROJECTS})
    },

    created() {
      this.fetchChangesCommittedPerProject();
      this.fetchProjects();
    },

    methods: {
      ...mapActions(EVENTS, {fetchChangesCommittedPerProject: FETCH_CHANGES_COMMITTED_PER_PROJECT}),
      ...mapActions(PROJECTS, {fetchProjects: FETCH_ALL_PROJECTS})
    }
  };
</script>

<style scoped>
</style>
