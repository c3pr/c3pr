<template>
  <div>
    <div class="text-xs-center">
      <v-dialog :value="display">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Event Details</v-card-title>
          <v-card-text>
            <pre style="font-size: x-small">{{ formattedObjetctDisplayedAtDialog }}</pre>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="$emit('ok')">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DisplayDialog',
  props: ['display', 'content'],
  model: {
    prop: 'display',
    event: 'ok'
  },
  computed: {
    formattedObjetctDisplayedAtDialog() {
      const objectAsString = JSON.stringify(this.content || "", null, 2);
      const withLineBreaks = (objectAsString).replace(/([^\\])(?:\\r)?\\n/g, "$1\n");
      return withLineBreaks.replace(/([^\\])\\t/g, "$1\t");
    }
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
