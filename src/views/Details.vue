<template>
  <div class="about" v-if="project">
    <h1>{{project.name}}</h1>
      <br><hr><br>

      <div class="parent">
        <strong class="child" style="padding-right:10px" >Project name:</strong>
        <input type="text" class="child" v-model="project.name"/><br>
      </div>

      <div class="parent">
        <strong class="child" style="padding-right:10px">Project tags:</strong>
        <multiselect class="child" style="width:20%" v-model="project.tags" placeholder="Search a tag" label="" :options="options" :multiple="true" :taggable="false"></multiselect><br>
      </div>

      <div class="parent">
        <strong class="child" style="padding-right:10px">Project Url:</strong>
        <input type="text" size="50" class="child" v-model="project.clone_url_http"/>
      </div>

      <a :href="project.clone_url_http">{{ project.clone_url_http }}</a><br>

    <br><hr><br>

      <h1>PRs</h1>

      <table style="margin: auto; margin-top: 10px;">
        <tr>
          <th>ID/Link</th>
          <th>Event/Link</th>
          <th>Status</th>
          <th>Files</th>
        </tr>
        <tr v-for="pr of project.prs" :key="pr._id">
          <td><a :href="pr.pr_url">{{ pr.pr_id }}</a></td>
          <td><router-link :to= "{ name: 'event-by-uuid', params: { uuid: pr.PullRequestRequested }}">{{ pr.PullRequestRequested }}</router-link></td>
          <td>{{ pr.status }}</td>
          <td>{{ pr.changed_files }}</td>
        </tr>
      </table>
    <br/>
    <button v-on:click="postProject">Salvar</button>
  </div>
</template>

<script>
import axios from "../envs";
import {mapActions, mapGetters} from "vuex";
import {FETCH_ALL_PROJECTS, GET_ALL_PROJECTS, PROJECTS} from "../store/modules/projects";

const proxyPrefix = "/api/hub";

export default {
  components: {
  	Multiselect: window.VueMultiselect.default
	},
  name: "Logs",
   props: ['projectId'],
  data() {
    return {
      project: null,
      options: [
        'maven',
        'java',
        'starwars',
        'Vue.js',
        'Javascript',
        'Open Source'
      ]
    };
  },
  computed: {
    ...mapGetters(PROJECTS, {projects: GET_ALL_PROJECTS})
  },

  created() {
    this.fetchProjects().then(() => {
      this.project = this.projects.find(p => p._id === this.projectId)
    })
  },

  methods: {
    ...mapActions(PROJECTS, {fetchProjects: FETCH_ALL_PROJECTS}),
    postProject() {
      axios.patch('/api/v1/projects/' + this.projectId, {clone_url_http: this.project.clone_url_http, name: this.project.name, tags: this.project.tags})
    }
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

.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px
}

.child {
  display: inline-block;
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

button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 2px;
}

pre {
  text-align: initial;
  white-space: pre-wrap;
}
</style>
