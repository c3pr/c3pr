<template>
  <div class="about">

    <h1>Projects</h1>
      <table style="margin: auto; margin-top: 10px;">
        <tr>
          <th>Name</th>
          <th>Clone-Url</th>
          <th>Open PRs</th>
          <th>Merged PRs</th>
          <th>Closed PRs</th>
          <th>Last Modification</th>
          <th>-</th>
          <th>-</th>
        </tr>
        <tr v-for="project in projects" :key="project._id">
          <td>{{project.name}}</td>
          <td><a :href="project.clone_url_http.replace('.git', '')">{{project.clone_url_http}}</a></td>
          <td><a :href="mergeRequestsLink(project)" target="_blank">{{ project.prs.filter(({status}) => status === "open").length }}</a></td>
          <td><a :href="mergeRequestsLink(project)" target="_blank">{{ project.prs.filter(({status}) => status === "merged").length }}</a></td>
          <td><a :href="mergeRequestsLink(project)" target="_blank">{{ project.prs.filter(({status}) => status === "closed").length }}</a></td>
          <td>{{ (changesCommittedPerProject.find(ccpp => ccpp._id.project_uuid === project.uuid) || {last_modified: "-"}).last_modified }}</td>
          <td><router-link :to= "{ name: 'project-details', params: { projectId: project._id, project: project }}">details</router-link></td>
          <td><router-link :to="{ name: 'events-per-project', params: { project_uuid: project.uuid }}">commit events</router-link></td>
        </tr>
      </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { PROJECTS, FETCH_ALL_PROJECTS, GET_ALL_PROJECTS } from "../store/modules/projects";
import {EVENTS, FETCH_CHANGES_COMMITTED_PER_PROJECT, GET_CHANGES_COMMITTED_PER_PROJECT} from "../store/modules/events";

export default {
  name: "Projects",

  data() {
    return {
      options: [
        'Maven',
        'Gradle',
        'Java',
        'Vue.js',
        'JavaScript ES5',
        'TypeScript',
        'Angular'
      ]
    };
  },

  computed: {
    ...mapGetters(PROJECTS, {projects: GET_ALL_PROJECTS}),
    ...mapGetters(EVENTS, {changesCommittedPerProject: GET_CHANGES_COMMITTED_PER_PROJECT}),
  },

  created() {
    this.fetchProjects();
    this.fetchChangesCommittedPerProject();
  },

  methods: {
    ...mapActions(PROJECTS, {fetchProjects: FETCH_ALL_PROJECTS}),
    ...mapActions(EVENTS, {fetchChangesCommittedPerProject: FETCH_CHANGES_COMMITTED_PER_PROJECT}),
    mergeRequestsLink(project) {
      return project.clone_url_http.replace('.git', '/merge_requests');
    },
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
