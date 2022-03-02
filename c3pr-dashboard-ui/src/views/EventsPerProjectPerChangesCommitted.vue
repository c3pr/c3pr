<template>
  <div class="about">

    <h1>Events per Changes Committed</h1>
    <h4>Changes Committed: {{ changes_committed_uuid }}</h4>
    <h4>Project: {{ project_uuid }}</h4>

    <br><br>
    <ul class="tree" v-html="eventTree"></ul>

    <event-list v-if="loaded" :events="eventsForProject"></event-list>
    <div v-else class="loading">Loading events...</div>

  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {
    EVENTS,
    FETCH_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED,
    GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED
  } from "../store/modules/events";
  import EventDetail from '../components/EventDetail.vue';
  import EventList from "../components/EventList";
  import 'treeflex/dist/css/treeflex.css'

  export default {
  name: "EventsPerProjectPerChangesCommitted",

  components: {EventDetail, EventList},

  props: {
    project_uuid: String,
    changes_committed_uuid: String
  },

  data() {
    return {
      loaded: false
    };
  },

  computed: {
    ...mapGetters(EVENTS, {getEventsForProjectByChangesCommitted: GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED}),
    eventsForProject() {
      return this.getEventsForProjectByChangesCommitted(this.project_uuid, this.changes_committed_uuid)
    },
    eventTree() {
        const map = {
            [this.changes_committed_uuid]: {
                uuid: this.changes_committed_uuid,
                event_type: 'ChangesCommitted',
                children: []
            }
        };
        this.eventsForProject.forEach(e => {
          let parentUuid = e.payload.parent.uuid;
          map[parentUuid] = map[parentUuid] || {children: []};
          map[parentUuid].children.push(e.uuid);
          map[e.uuid] = {
            uuid: e.uuid,
            event_type: e.event_type,
            status: e.meta.status,
            children: []
          }
        });
        const toHtml = uuid => `
          <li>
            <a class="stuff">${map[uuid].event_type} (${uuid.split('-').slice(-1)[0]})</a>${ go(uuid) }
          </li>
        `;
        function go(root_uuid) {
            const cs = map[root_uuid].children;
            if (!cs.length) {
                return '';
            }
            return `<ul>${cs.map(toHtml).join('')}</ul>`
        }
        return toHtml(this.changes_committed_uuid);
    }
  },

  async mounted() {
    await this.fetchEventsForProjectByChangesCommitted({project_uuid: this.project_uuid, changes_committed_uuid: this.changes_committed_uuid});
    this.loaded = true
  },

  methods: {
    ...mapActions(EVENTS, {fetchEventsForProjectByChangesCommitted: FETCH_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED})
  }
};
</script>

<style scoped>
  .stuff {
    font-family: monospace !important;
    font-size: x-small;
  }
</style>
