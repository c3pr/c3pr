<template>
  <div class="about">
    <h1>Event</h1>
    <div v-if="project_uuid">

      <router-link :to= "{ name: 'events-per-project-per-changes-committed', params: { project_uuid , changes_committed_uuid: changes_committed_root }}">Ver changes commit root event {{ changes_committed_root }}</router-link>
    </div>
    <hr>
    <pre>{{ event }}</pre>
  </div>
</template>

<script>
  import eventsApi from "../api/eventsApi";

  export default {
  name: "EventsByUuid",

  props: {
    'uuid': String
  },

  data() {
    return {
      event: null,
      project_uuid: null
    };
  },

  async created() {
    this.event = await eventsApi.findEventByUuid(this.uuid);
  },

  computed: {
    changes_committed_root() {
      return this.event && this.event.payload && this.event.payload.changes_committed_root;
    }
  },

  watch: {
    async changes_committed_root() {
      if (this.changes_committed_root) {
        let {payload: {project_uuid}} = await eventsApi.findEventByUuid(this.changes_committed_root);
        this.project_uuid = project_uuid;
      }
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
