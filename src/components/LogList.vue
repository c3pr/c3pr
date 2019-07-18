<template>
    <div>
      <table>
        <thead>
        <tr>
          <th>date</th>
          <th>sha</th>
          <th>euuid</th>
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
          <td><a href="#" @click.prevent.stop="objetctDisplayedAtDialog = {lcid: log.lcid, sha: log.sha, euuid: log.euuid}">{{ (log.sha || '').substr(0, 4) }}</a></td>
          <td><a href="#" @click.prevent.stop="objetctDisplayedAtDialog = {lcid: log.lcid, sha: log.sha, euuid: log.euuid}">{{ (log.euuid || '').substr(0, 4) }}</a></td>
          <td>{{ log.service_name }}</td>
          <td style="font-size: xx-small">{{ log.caller_name }}</td>
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
  .message {
    text-align: left; font-family: monospace;
  }
  .c3pr-hub { background-color: #005900; }
  .c3pr-brain { background-color: #41629c; }
  .c3pr-repo-gitlab { background-color: #544500; }
  .c3pr-agent, .c3pragent, .evalmachine { background-color: #111111; }
  .mono {
    text-align: left;
    font-family: monospace;
    font-size: x-small;
  }
</style>
