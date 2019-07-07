<template>
  <div>

    <table>
      <thead>
      <tr>
        <th>sha</th>
        <th>event_type</th>
        <th>status</th>
        <th>created</th>
        <th>modified</th>
        <th>Logs</th>
        <th>Details</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event of events">
        <td>{{ sha(event) }}</td>
        <td>{{ event.event_type }}</td>
        <td>{{ status(event) }}</td>
        <td>{{ (event.meta.created || "").replace("T", " ") }}</td>
        <td>{{ (event.meta.modified || "").replace("T", " ") }}</td>
        <td><router-link :to= "{ name: 'logs-euuid', params: { euuid: event.uuid }}">logs</router-link></td>
        <td><a href="#" @click.prevent.stop="eventDisplayedAtDialog = event">details</a></td>
      </tr>
      </tbody>
    </table>

    <display-dialog v-model="eventDisplayedAtDialog"></display-dialog>

  </div>
</template>

<script>
import DisplayDialog from '../components/DisplayDialog.vue';
import {sha, status} from "../app/events";

export default {
  name: 'EventList',
  components: {DisplayDialog},
  props: ['events'],
  data() {
    return {
      eventDisplayedAtDialog: null
    };
  },
  methods: {
    sha,
    status
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
