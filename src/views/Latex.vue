<script>
  import { mapActions, mapGetters } from 'vuex';
  import { PROJECTS, FETCH_ALL_PROJECTS, GET_ALL_PROJECTS } from "../store/modules/projects";
  import {
    EVENTS,
    FETCH_CHANGES_COMMITTED_PER_PROJECT,
    FETCH_EVENTS_FOR_PROJECT, FETCH_TOOL_INVOCATIONS_PER_PROJECT,
    GET_CHANGES_COMMITTED_PER_PROJECT, GET_EVENTS, GET_TOOL_INVOCATIONS_PER_PROJECT
  } from "../store/modules/events";

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

    render(h) {
      return h(
        'pre',
this.projects.length +
`
\\begin{table}[]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|l|l|l|l|l|l|l|l|l|}
\\hline
\\multirow{2}{*}{Project} & \\multicolumn{4}{l|}{Pull Requests} & \\multirow{2}{*}{KLOCs} & \\multirow{2}{*}{Tags} & \\multirow{2}{*}{Commits} & \\multirow{2}{*}{\\begin{tabular}[c]{@{}l@{}}Tool\\\\ Invocations\\end{tabular}} \\\\ \\cline{2-4}
                         & Open     & Merged     & Closed     & Total     &                        &                       &                          &                                                                             \\\\ \\hline
${this.projects.map(p =>
  p.name + " & " +
  p.prs._open + " & " +
  p.prs._merged + (!p.prs._merged ? '' : " (" + (p.prs._merged / (p.prs._merged + p.prs._closed) * 100).toFixed(0) + "%)") + " & " +
  p.prs._closed + (!p.prs._closed ? '' : " (" + (p.prs._closed / (p.prs._merged + p.prs._closed) * 100).toFixed(0) + "%)") + " & " +
  p.prs.length + " & " +
  (p.klocs || '?') + " & " +
  p.tags.join(", ") + " & " +
  (this.changesCommittedPerProject.find(ccpp => ccpp._id.project_uuid === p.uuid) || {count:0}).count + " & " +
    (this.toolInvocationsPerProject.find(tipp => tipp._id.project_url === p.clone_url_http) || {count:0}).count +
  "  \\\\ \\hline \n"
).join("")}
\\end{tabular}%
}
\\caption{Summary of projects analyzed by C-3PR.}
\\label{tab:summary}
\\end{table}
`
      )
    },

    computed: {
      ...mapGetters(PROJECTS, {projects: GET_ALL_PROJECTS}),
      ...mapGetters(EVENTS, {changesCommittedPerProject: GET_CHANGES_COMMITTED_PER_PROJECT, toolInvocationsPerProject: GET_TOOL_INVOCATIONS_PER_PROJECT}),
    },

    created() {
      this.fetchProjects();
      this.fetchChangesCommittedPerProject();
      this.fetchTIForProjects();
    },

    methods: {
      ...mapActions(PROJECTS, {fetchProjects: FETCH_ALL_PROJECTS}),
      ...mapActions(EVENTS, {fetchChangesCommittedPerProject: FETCH_CHANGES_COMMITTED_PER_PROJECT, fetchTIForProjects: FETCH_TOOL_INVOCATIONS_PER_PROJECT}),
      mergeRequestsLink(project) {
        return project.clone_url_http.replace('.git', '/merge_requests');
      },
    }

  };
</script>

<style scoped>
  pre { text-align: left; }
</style>
