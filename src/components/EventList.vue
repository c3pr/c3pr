<template>
  <div>

    <table>
      <thead>
      <tr>
        <th>sha</th>
        <th>uuid</th>
        <th>project</th>
        <th>event_type</th>
        <th>status</th>
        <th>created</th>
        <th>modified</th>
        <th>-</th>
        <th>+</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event of eventsWithDateFormatted" :class="clazz(event)">
        <td>{{ sha(event) }}</td>
        <td>{{ event.uuid.substring(0, 4) }}</td>
        <td>{{ event._project }}</td>
        <td :class="event.event_type">{{ event.event_type }}</td>
        <td>{{ status(event) }}</td>
        <td :class="{highlight: event.meta._isToday}" :title="event.meta.created">{{ event.meta._createdFromNow }}</td>
        <td :class="{highlight: event.meta._isToday}" :title="event.meta.modified">{{ event.meta._modifiedFromNow }}</td>
        <td>
          [<router-link :to= "{ name: 'logs-euuid', params: { euuid: event.uuid }}">logs</router-link>]
          [<a href="#" @click.prevent.stop="eventDisplayedAtDialog = event">details</a>]
        </td>
        <td @click="mouseOver(event)" v-html="event._specifics"></td>
      </tr>
      </tbody>
    </table>

    <display-dialog v-model="eventDisplayedAtDialog"></display-dialog>

  </div>
</template>

<script>
import DisplayDialog from '../components/DisplayDialog.vue';
import {sha, status, parent} from "../app/events";
import {diasAtras, formatarData, isToday} from "../app/data";


function truncate(text) {
  if (text.length > 50)
    return '...' + text.slice(-50);
  else
    return text;
}

export default {
  name: 'EventList',
  components: {DisplayDialog},
  props: ['events'],
  data() {
    return {
      eventDisplayedAtDialog: null,
      selected: null
    };
  },
  methods: {
    sha,
    status,
    specifics(event) {
      switch (event.event_type) {
        case 'ToolInvocationRequested':
          return `<span style="color: yellow">${event.payload.tool_id}</span><br><span style="color: gray"> - ${event.payload.files.map(truncate).join("<br> - ")}</span>`;
        default:
          return '';
      }
    },
    mouseOver(event){
      this.selected = event;
    },
    parent,
    clazz(event) {
      return {
        parent: this.parentUuid === event.uuid,
        'grand-parent': this.grandParentUuid === event.uuid,
        selected: this.selected && (this.selected.uuid === event.uuid),
        child: this.selected && (this.selected.uuid === this.parent(event)),
        'grand-child': this.grandChildrenUuids.includes(event.uuid)
      }
    }
  },
  computed: {
    eventsWithDateFormatted() {
      const es = [...this.events];
      es.sort((a, b) => b.meta.created.localeCompare(a.meta.created));
      return es.map(e => ({
        ...e,
        meta: {
          ...e.meta,
          created: formatarData(e.meta.created),
          modified: formatarData(e.meta.modified),
          _createdFromNow: diasAtras(e.meta.created),
          _modifiedFromNow: diasAtras(e.meta.modified),
          _isToday: isToday(e.meta.created)
        },
        _specifics: this.specifics(e),
        _project: ((e.payload.repository || {}).clone_url_http || "").split("/").slice(-1)[0].replace(".git", "")
      }))
    },
    parentUuid() {
      return this.parent(this.selected);
    },
    grandParentUuid() {
      const parentEvent = this.events.find(e => e.uuid === this.parentUuid);
      return this.parent(parentEvent);
    },
    grandChildrenUuids() {
      if (!this.selected) return [];
      const children = this.events.filter(e => this.parent(e) === this.selected.uuid).map(e => e.uuid);
      return this.events.filter(e => children.includes(this.parent(e))).map(e => e.uuid);
    },
  }
};
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
  .grand-child { background-color: #487271 !important; }
  .child { background-color: #72556a !important; }
  .selected { background-color: #000000 !important; }
  .parent { background-color: #444400 !important; }
  .grand-parent { background-color: #721b01 !important; }
  .ToolInvocationRequested { color: #00a800; }
  .ToolInvocationCompleted { color: #577ecb; }
</style>
