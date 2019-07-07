<template>
    <div>
      <table>
        <thead>
        <tr>
          <th>date</th>
          <th>sha</th>
          <th>service</th>
          <th>caller_name</th>
          <th>message</th>
          <th>error</th>
          <th>meta</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="log of logs" :class="log.node" :key="log._id">
          <td>{{ log.date_time.replace(/[TZ]/g, ' ') }}</td>
          <td><a href="#" @click.prevent.stop="objetctDisplayedAtDialog = {lcid: log.lcid, sha: log.sha, euuid: log.euuid}">{{ (log.sha || '').substr(0, 7) }}</a></td>
          <td>{{ log.service_name }}</td>
          <td style="font-size: x-small">{{ log.caller_name }}</td>
          <td :title="log.message" class="message" :class="log.service_name">
            {{ log.message.substr(0, logMessageSize) }}
            <a v-if="log.message.length > logMessageSize" href="#" @click.prevent.stop="objetctDisplayedAtDialog = log.message" class="message">[...]</a>
          </td>
          <td>
            <span v-if="log.error"><a href="#" @click.prevent.stop="objetctDisplayedAtDialog = log.error">error</a></span>
            <span v-else>-</span>
          </td>
          <td><a href="#" @click.prevent.stop="objetctDisplayedAtDialog = log.metadata">meta</a></td>
        </tr>
        </tbody>
      </table>

      <display-dialog v-model="objetctDisplayedAtDialog"></display-dialog>
    </div>
</template>

<script>
  import DisplayDialog from "./DisplayDialog";

  export default {
    name: "LogList",
    props: ['logs'],
    components: {DisplayDialog},
    data() {
      return {
        logMessageSize: 100,
        objetctDisplayedAtDialog: null,
      };
    },
  }
</script>

<style scoped>
  td, th { border: 1px solid black; border-collapse: collapse; padding: 0 5px 0 5px }
  th { background-color: #ededed; font-weight: bold; }
  table { font-family: monospace; font-size: small; border-collapse: collapse; margin: auto; text-align: left; }
  pre {
    text-align: initial;
    white-space: pre-wrap;
  }

  .message {
    text-align: left; font-family: monospace;
    color: white;
  }
  .c3pr-hub { background-color: green; }
  .c3pr-brain { background-color: cornflowerblue; }
  .c3pr-repo-gitlab { background-color: orange; }
  .c3pr-agent, .c3pragent, .evalmachine { background-color: gray; }
  .mono {
    text-align: left;
    font-family: monospace;
    font-size: x-small;
  }
</style>
