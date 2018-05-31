<template>
  <div class="about">

    <h1>Projects</h1>

    <table>
      <tr v-for="project of projects" :key="project._id">
        <td style="padding: 10px 5px 10px 5px">
          <table class="project-table">
            <tbody>
            <tr  v-for="(value, key) of project">
              <td class="grayed">{{ key }}</td>
              <td>{{ value }}</td>
            </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import axios from 'axios';

  const proxyPrefix = '/api/hub';
  export default {
    name: 'Logs',
    data() {
      return {
        projects: []
      };
    },
    created() {
      this.fetchProjects();
    },
    methods: {
      async fetchProjects() {
        const {data} = await axios.get(proxyPrefix + '/api/v1/projects');
        this.projects = data;
      },
    }
  };
</script>

<style scoped>
  table.project-table td, table.project-table th {
    border: 1px solid black;
    border-collapse: collapse;
    padding: 2px
  }

  th {
    background-color: #ededed
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
