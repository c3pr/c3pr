<template>
  <div class="about">
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
        <input type="text" size="50" class="child" v-model="project.clone_url_http"/><br>
      </div>
    <button v-on:click="postProject">Salvar</button>
  </div>
</template>

<script>
import axios from "../envs";

const proxyPrefix = "/api/hub";
export default {
  components: {
  	Multiselect: window.VueMultiselect.default
	},
  name: "Logs",
   props: ['projectId', 'project'],
  data() {
    return {
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
  methods: {
    postProject() {
      axios.post('/api/v1/projects/' + this.projectId, {clone_url_http: this.project.clone_url_http, name: this.project.name, tags: this.project.tags})
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

pre {
  text-align: initial;
  white-space: pre-wrap;
}
</style>
