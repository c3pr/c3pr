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
\\begin{tabular}{|l|l|l|l|l|l|l|l|}
\\hline
\\multirow{2}{*}{Project} & \\multicolumn{3}{l|}{Pull Requests} & \\multirow{2}{*}{KLOCs} & \\multirow{2}{*}{Tags} & \\multirow{2}{*}{Commits} & \\multirow{2}{*}{\\begin{tabular}[c]{@{}l@{}}Tool\\\\ Invocations\\end{tabular}} \\\\ \\cline{2-4}
                         & Open     & Merged     & Closed     &                        &                       &                          &                                                                             \\\\ \\hline
${this.projects.map(p =>
  p.name + " & " +
  p.prs.filter(({status}) => status === "open").length + " & " +
  p.prs.filter(({status}) => status === "merged").length + " & " +
  p.prs.filter(({status}) => status === "closed").length + " & " +
  " klocs " + " & " +
  " lang " + " & " +
  this.changesCommittedPerProject.filter(ccpp => ccpp._id.project_uuid === p.uuid).length + " & " +
  this.toolInvocationsPerProject.filter(ccpp => ccpp._id.project_uuid === p.uuid).length +
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
