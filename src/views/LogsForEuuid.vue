<template>
  <div class="about">
    <br>
    <span v-if="updatingEvent">Updating event...</span>
    <h1 style="color: yellow">{{ ev && ev.payload && ev.payload.repository && ev.payload.repository.clone_url_http  && ev.payload.repository.clone_url_http.split('/').slice(-1)[0].split('.')[0] }}</h1>
    <br>
    <br>
    <div class="tf-tree tf-gap-lg">
      <ul>
        <li>
          <span class="tf-nc" v-if="ev && ev.payload.parent && ev.payload.parent.uuid">
            <router-link :to= "{ name: 'logs-euuid', params: { euuid: ev.payload.parent.uuid }}">
              {{ ev.payload.parent.event_type }}<br>{{ ev.payload.parent.uuid.split('-')[0] }}
            </router-link>
          </span>
          <ul>
            <li>
              <span class="tf-nc">
                 <span style="color: #72556a">(You are here!)</span><br>
                {{ ev && ev.event_type }}
                <br>{{ ev && ev.uuid.split('-')[0] }}<br>
                <span :class="ev && ev.meta.status">
                  <v-icon v-if="ev && ev.meta.status === 'PROCESSED'">done</v-icon>
                  <v-icon v-if="ev && ev.meta.status === 'UNPROCESSED'">clear</v-icon>
                  {{ ev && ev.meta.status }}
                </span>
                <br>
                <v-btn v-if="ev && ev.meta && ev.meta.status !== 'PROCESSED'" style="color: darkred" @click="markEventAsProcessed(ev.uuid)">Mark as PROCESSED</v-btn>
                <v-btn v-if="ev && ev.meta && ev.meta.status !== 'UNPROCESSED'" style="color: green" @click="markEventAsUnprocessed(ev.uuid)">Mark as UNPROCESSED</v-btn>
              </span>
              <ul v-if="children.length">
                <li v-for="c of children">
                  <span class="tf-nc">
                  <router-link :to= "{ name: 'logs-euuid', params: { euuid: c.uuid }}">
                    {{ c.event_type }}<br>{{ c.uuid.split('-')[0] }}
                  </router-link>
                    <br>
                    <span :class="c.meta.status">
                      <v-icon v-if="c.meta.status === 'PROCESSED'">done</v-icon>
                      <v-icon v-if="c.meta.status === 'UNPROCESSED'">clear</v-icon>
                      {{ c.meta.status }}
                    </span>
                  <br>
                  <v-btn v-if="c.meta.status !== 'PROCESSED'" style="color: darkred" @click="markEventAsProcessed(c.uuid)">Mark as PROCESSED</v-btn>
                  <v-btn v-if="c.meta.status !== 'UNPROCESSED'" style="color: green" @click="markEventAsUnprocessed(c.uuid)">Mark as UNPROCESSED</v-btn>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <logs-for label="Event" :value="euuid" @refresh="reFetch" />

    <br><br>
    <pre class="codepre">{{ ev }}</pre>
    <a :href="`http://${$store.state.GLOBAL.dbwebui}/db/c3pr/events?key=uuid&value=${ev.uuid}&type=S`" target="_blank">Edit Event</a>

    <div v-if="ev && ev.payload.diff_base64">
    <br><br>
    <pre class="codepre" style="color: greenyellow;">{{ fromBase64(ev.payload.diff_base64) }}</pre>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { LOGS, FETCH_LOGS_FOR_EUUID } from "../store/modules/logs";
import LogsFor from "../components/LogsFor";
import eventsApi from "../api/eventsApi";

export default {
  name: 'LogsForEuuid',
  components: {
      LogsFor
  },
  props: {
    euuid: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      updatingEvent: false,
      ev: null,
      children: []
    }
  },

  watch: {
    euuid: {
      immediate: true,
      handler () {
        this.reFetch();
      }
    }
  },

  methods: {
    ...mapActions(LOGS, {fetchLogsForEuuid: FETCH_LOGS_FOR_EUUID}),

    async reFetch() {
      await this.fetchLogsForEuuid(this.euuid);
      this.ev = await eventsApi.findEventByUuid(this.euuid);
      this.children = await eventsApi.findAllChildren(this.euuid);
    },

    async doThenReFetch(fn) {
      this.updatingEvent = true;
      await fn();
      this.updatingEvent = false;
      this.reFetch();
    },

    markEventAsUnprocessed(euuid) {
      this.doThenReFetch(() => eventsApi.markEventAsUnprocessed(euuid));
    },

    async markEventAsProcessed(euuid) {
      this.doThenReFetch(() => eventsApi.markEventAsProcessed(euuid));
    },

    fromBase64(x) {
      return atob(x);
    }
  }

};
</script>

<style scoped>
  .codepre {
    background-color: #000000;
    border: 1px solid #808080;
    font-family: monospace;
    font-size: small;
    margin: 5px 15%;
    text-align: left;

    white-space: pre-wrap;
    word-wrap: break-word;

    padding: 0 5px 0 5px;
  }
  span.PROCESSED, span.PROCESSED .v-icon {
    color: #00a800;
  }
  span.UNPROCESSED, span.UNPROCESSED .v-icon {
    color: #e8743a;
  }
</style>
