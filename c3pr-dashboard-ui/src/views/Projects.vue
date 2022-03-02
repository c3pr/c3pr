<template>
  <div class="about">

    <h1>Projects</h1>
      <table style="margin: auto; margin-top: 10px;">
        <tr>
          <th rowspan="2">Name</th>
          <th rowspan="2">Clone-Url</th>
          <th colspan="3">Pull/Merge Requests</th>
          <th rowspan="2">Last Commit</th>
          <th rowspan="2">-</th>
        </tr>
        <tr>
          <th>Open</th>
          <th>Merged</th>
          <th>Closed</th>
        </tr>
        <tr v-for="project in projects" :key="project._id">
          <td>{{project.name}}</td>
          <td><a :href="project.clone_url_http.replace('.git', '')">{{project.clone_url_http}}</a></td>
          <td class="centered" :class="{highlight: project.prs.filter(({status}) => status === 'open').length}"><a :href="mergeRequestsLink(project)" target="_blank">{{ project.prs.filter(({status}) => status === "open").length }}</a></td>
          <td class="centered"><a :href="mergeRequestsLink(project)" target="_blank">{{ project.prs.filter(({status}) => status === "merged").length }}</a></td>
          <td class="centered"><a :href="mergeRequestsLink(project)" target="_blank">{{ project.prs.filter(({status}) => status === "closed").length }}</a></td>
          <td :class="{highlight: lastModifiedToday(project)}">{{ lastModified(project) }}</td>
          <td>
            [<router-link :to= "{ name: 'project-details', params: { projectId: project._id, project: project }}">details</router-link>]
            [<router-link :to="{ name: 'events-per-project', params: { project_uuid: project.uuid }}">commit events</router-link>]
          </td>
        </tr>
      </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { PROJECTS, FETCH_ALL_PROJECTS, GET_ALL_PROJECTS } from "../store/modules/projects";
import {EVENTS, FETCH_CHANGES_COMMITTED_PER_PROJECT, GET_CHANGES_COMMITTED_PER_PROJECT} from "../store/modules/events";
import moment from "moment";
import {formatarData} from "../app/data";

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
    lastCC(project) {
        return this.changesCommittedPerProject.find(ccpp => ccpp._id.project_uuid === project.uuid);
    },
    lastModified(project) {
        const lastCC = this.lastCC(project);
        return lastCC && formatarData(lastCC.last_modified) || "-";
    },
    lastModifiedToday(project) {
        const lastCC = this.lastCC(project);
        return lastCC && moment(lastCC.last_modified).isSame(moment(), "day");
    },
  }

};
</script>

<style scoped>
td, th { padding: 5px; }
.centered { text-align: center; }
</style>
