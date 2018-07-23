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
          <th>Actions</th>
        </tr>
        <tr v-for="project in projects" :key="project._id">
          <td>{{project.name}}</td>
          <td>{{project.clone_url_http}}</td>
          <td>{{ project.prs.filter(({status}) => status === "open").length }}</td>
          <td>{{ project.prs.filter(({status}) => status === "merged").length }}</td>
          <td>{{ project.prs.filter(({status}) => status === "closed").length }}</td>
          <td><router-link :to= "{ name: 'details', params: { projectId: project._id, project: project }}">details</router-link></td>
        </tr>
      </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { PROJECTS, FETCH_ALL_PROJECTS, GET_ALL_PROJECTS } from "../store/modules/projects";

export default {
  name: "Projects",

  data() {
    return {
      options: [
        'Maven',
        'Gradle',
        'Java',
        'starwars',
        'Vue.js',
        'JavaScript',
        'TypeScript',
        'Angular'
      ]
    };
  },

  computed: {
    ...mapGetters(PROJECTS, {projects: GET_ALL_PROJECTS})
  },

  created() {
    this.fetchProjects();
  },

  methods: {
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
