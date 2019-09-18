<template>
  <div class="about">

    <h1>Changes Committed</h1>
    <h3>For project {{ project_uuid }}</h3>

    <br>

    <table v-if="loaded">
      <thead>
      <tr>
        <th>sha</th>
        <th>status</th>
        <th>created</th>
        <th>modified</th>
        <th width="365px">commit message</th>
        <th title="Modified Files">files</th>
        <th>-</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event of eventsForProject" :class="event.node">
        <td>{{ sha(event) }}</td>
        <td>{{ status(event) }}</td>
        <td :class="{highlight: event.meta._isToday}" :title="event.meta.created">{{ event.meta._createdFromNow }}</td>
        <td :class="{highlight: event.meta._isToday}" :title="event.meta.modified">{{ event.meta._modifiedFromNow }}</td>
        <td :title="webhook(event).commits[0].message">
          {{ webhook(event).commits[0].message.substring(0, 50) }}{{ webhook(event).commits[0].message.length > 50 ? '...' : '' }}
        </td>
        <td :title="event.payload.changed_files.join('\n')">{{ event.payload.changed_files.length }}</td>
        <td>
          [<router-link :to= "{ name: 'events-per-project-per-changes-committed', params: { project_uuid, changes_committed_uuid: event.uuid }}">events for this commit</router-link>]
          [<router-link :to= "{ name: 'logs-euuid', params: { euuid: event.uuid }}">logs</router-link>]
        </td>
      </tr>
      </tbody>
    </table>
    <div v-else class="loading">Loading events...</div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { EVENTS, FETCH_EVENTS_FOR_PROJECT, GET_EVENTS_BY_TYPE_FOR_PROJECT } from "../store/modules/events";
import {sha, status, webhook} from "../app/events";
import {diasAtras, formatarData, isToday} from "../app/data";

export default {
  name: "Events",

  components: {},

  props: {
    'project_uuid': String
  },

  data() {
    return {
      event_type: 'ChangesCommitted',
      loaded: false
    };
  },

  computed: {
    ...mapGetters(EVENTS, {getEventsOfTypeForProject: GET_EVENTS_BY_TYPE_FOR_PROJECT}),
    eventsForProject() {
      const ccsForProject = [...this.getEventsOfTypeForProject(this.project_uuid, this.event_type)];
      ccsForProject.sort((a, b) => b.meta.created.localeCompare(a.meta.created));
      return ccsForProject.map(cc => ({
        ...cc,
        meta: {
          ...cc.meta,
          created: formatarData(cc.meta.created),
          modified: formatarData(cc.meta.modified),
          _createdFromNow: diasAtras(cc.meta.created),
          _modifiedFromNow: diasAtras(cc.meta.modified),
          _isToday: isToday(cc.meta.created)
        }
      }))
    }
  },

  async mounted() {
    await this.fetchEventsForProject({project_uuid: this.project_uuid, event_type: this.event_type});
    this.loaded = true;
  },

  methods: {
    ...mapActions(EVENTS, {fetchEventsForProject: FETCH_EVENTS_FOR_PROJECT}),
    sha,
    status,
    webhook
  }
};
</script>

<style scoped>
</style>
