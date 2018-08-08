<template>
  <div>

    <table>
      <thead>
      <tr>
        <th>uuid</th>
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
        <td>{{ event.uuid.split("-")[0] }}</td>
        <td>{{ event.event_type }}</td>
        <td>{{ event.meta.status }}</td>
        <td>{{ (event.meta.created || "").replace("T", " ") }}</td>
        <td>{{ (event.meta.modified || "").replace("T", " ") }}</td>
        <td><router-link :to= "{ name: 'logs-euuid', params: { euuid: event.uuid }}">logs</router-link></td>
        <td><v-btn color="primary" small @click="displayAtDialog(event)"><v-icon>local_offer</v-icon>Details</v-btn></td>
      </tr>
      </tbody>
    </table>

    <display-dialog v-model="displayDialog" :content="objetctDisplayedAtDialog"></display-dialog>

  </div>
</template>

<script>
import DisplayDialog from '../components/DisplayDialog.vue';

export default {
  name: 'EventList',
  components: {DisplayDialog},
  props: ['events'],
  data() {
    return {
      objetctDisplayedAtDialog: null,
      displayDialog: false
    };
  },
  methods: {
    displayAtDialog(obj) {
      this.objetctDisplayedAtDialog = obj;
      this.displayDialog = false;
      this.$nextTick(() => this.displayDialog = true)
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
