<template>
    <div>
      <table>
        <thead>
        <tr>
          <th>date</th>
          <th>lcid</th>
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
        <tr v-for="log of logsWithFormattedDates" :class="log.node" :key="log._id">
          <td :class="{highlight: log._isToday}" :title="log.date_time">{{ log._dateTimeFromNow }}</td>
          <td>
            <span :title="log.lcid">
              <router-link :to= "{ name: 'logs-lcid', params: { lcid: log.lcid }}">{{ (log.lcid || '').substr(0, 4) }}</router-link>
            </span>
          </td>
          <td>
            <span :title="log.sha">
              <router-link :to= "{ name: 'logs-sha', params: { sha: log.sha }}">{{ (log.sha || '').substr(0, 4) }}</router-link>
            </span>
          </td>
          <td>
            <span :title="log.euuid">
              <router-link :to= "{ name: 'logs-euuid', params: { euuid: log.euuid }}">{{ (log.euuid || '').substr(0, 4) }}</router-link>
            </span>
          </td>
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
  import {diasAtras, formatarData, isToday} from "../app/data";

  export default {
    name: "LogList",
    props: {
        logs: {
            type: Array,
            required: true
        }
    },
    components: {DisplayDialog},
    data() {
      return {
        logMessageSize: 100,
        objetctDisplayedAtDialog: null,
      };
    },
    computed: {
      logsWithFormattedDates() {
        const ls = [...this.logs];
        return ls.map(log => ({
          ...log,
          date_time: formatarData(log.date_time),
          _dateTimeFromNow: diasAtras(log.date_time),
          _isToday: isToday(log.date_time)
        }))
      }
    }
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
