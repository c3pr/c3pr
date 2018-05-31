<template>
  <div>
    <table class="event-table" v-for="contractType of Object.keys($data)" v-if="event_type === contractType">
      <tbody><tr v-for="prop of $data[contractType]"><td class="grayed">{{ Array.isArray(prop) ? prop[0] : prop }}</td><td>{{ display(prop, payload) }}</td></tr></tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'EventDetail',
  props: ['event_type', 'payload'],
  data() {
      return {
          ChangesCommitted: ['changed_files', 'repository.clone_url_http'],
          ToolInvocationRequested: ['parent.event_type', ['parent.uuid', 'id'], ['changes_committed_root', 'id'], 'tool_id', 'files', 'repository.clone_url_http'],
          ToolInvocationCompleted: ['parent.event_type', ['parent.uuid', 'id'], ['changes_committed_root', 'id'], 'changed_files', 'unmodified_files', 'pr_title', 'diff_base64.length', 'repository.clone_url_http'],
          PullRequestRequested: ['parent.event_type', ['parent.uuid', 'id'], 'assignee', 'pr_title', 'repository.clone_url_http'],
          PullRequestUpdated: [],

          functions: {
            id(uuid) { return uuid.split("-")[0]; }
          }
      }
  },
  methods: {
    display(path, obj) {
      if (Array.isArray(path)) {
        let value = this.resolve(path[0], obj);
        return this.functions[path[1]](value);
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
