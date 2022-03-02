<template>
  <div>
    <table class="event-table" v-for="contractType of Object.keys($data)" v-if="event_type === contractType">
      <tbody>
      <tr v-for="prop of $data[contractType]">
        <td class="grayed">{{ typeof prop === 'object' ? Object.values(prop)[0] : prop }}</td>
        <td>{{ display(prop, payload) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'EventDetail',
  props: ['event_type', 'payload'],
  data() {
      return {
          ChangesCommitted: [{id: 'project_uuid'}, 'changed_files', {date: 'date'}, 'repository.clone_url_http'],
          ToolInvocationRequested: ['parent.event_type', {id: 'parent.uuid'}, {id: 'changes_committed_root'}, 'tool_id', 'files', 'repository.clone_url_http'],
          ToolInvocationCompleted: ['parent.event_type', {id: 'parent.uuid'}, {id: 'changes_committed_root'}, 'changed_files', 'unmodified_files', 'pr_title', 'diff_base64.length', 'repository.clone_url_http'],
          PullRequestRequested: ['parent.event_type', {id: 'parent.uuid'}, 'assignee', 'pr_title', 'repository.clone_url_http'],
          PullRequestUpdated: [],

          functions: {
            id(uuid) { return uuid.split("-")[0]; },
            date(d) { return (d || "").replace("T", " "); }
          }
      }
  },
  methods: {
    display(path, obj) {
      if (typeof path === 'object') {
        let [[functionToBeApplied, propertyPath]] = Object.entries(path);
        let value = this.resolve(propertyPath, obj);
        return this.functions[functionToBeApplied](value);
      }
      return this.resolve(path, obj);
    },
    resolve(path, obj) {
        return path.split('.').reduce(function(prev, curr) {
            return prev ? prev[curr] : undefined
        }, obj || self)
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .event-table {
        margin: 0;
    }
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
