import Vue from 'vue';
import eventsApi from "../../api/eventsApi";

export const EVENTS = 'EVENTS';

export const FETCH_EVENTS_FOR_PROJECT = 'FETCH_EVENTS_FOR_PROJECT';
export const FETCH_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED = 'FETCH_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED';
export const FETCH_CHANGES_COMMITTED_PER_PROJECT = 'FETCH_CHANGES_COMMITTED_PER_PROJECT';
export const FETCH_TOOL_INVOCATIONS_PER_PROJECT = 'FETCH_TOOL_INVOCATIONS_PER_PROJECT';
export const PROCESS_EVENTS = 'PROCESS_EVENTS';

export const FETCH_EVENTS_UNPROCESSED_AND_PROCESSING = 'FETCH_EVENTS_UNPROCESSED_AND_PROCESSING';

export const GET_EVENTS_BY_TYPE_FOR_PROJECT = 'GET_EVENTS_BY_TYPE_FOR_PROJECT';
export const GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED = 'GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED';
export const GET_CHANGES_COMMITTED_PER_PROJECT = 'GET_CHANGES_COMMITTED_PER_PROJECT';
export const GET_TOOL_INVOCATIONS_PER_PROJECT = 'GET_TOOL_INVOCATIONS_PER_PROJECT';

export const GET_EVENTS = 'GET_EVENTS';
export const GET_EVENTS_UNPROCESSED = 'GET_EVENTS_UNPROCESSED';
export const GET_EVENTS_PROCESSING = 'GET_EVENTS_PROCESSING';

export const UPDATE_EVENT = 'UPDATE_EVENT';
export const UPDATE_EVENT_FOR_PROJECT = 'UPDATE_EVENT_FOR_PROJECT';
export const UPDATE_EVENTS_FOR_PROJECT = 'UPDATE_EVENTS_FOR_PROJECT';
export const UPDATE_CHANGES_COMMITTED_PER_PROJECT = 'UPDATE_CHANGES_COMMITTED_PER_PROJECT';
export const UPDATE_TOOL_INVOCATIONS_PER_PROJECT = 'UPDATE_TOOL_INVOCATIONS_PER_PROJECT';


const state = {
  eventType: 'ChangesCommitted',
  changesCommittedPerProject: [],
  toolInvocationRequestedPerProject: [],
  eventsPerProject: {
    /*
    "6068bb20-6145-4e3c-a9d3-2096fd2db24b": { // project key
      "ChangesCommitted": {
        "7d7f223c-649f-42e5-89c5-7aa04bfe41c8": {}
      }
    }
    */
  },
  events: {}
};

function flatten(arrayOfArrays) {
  return [].concat.apply([], arrayOfArrays);
}

const getters = {
  [GET_CHANGES_COMMITTED_PER_PROJECT]: state => {
    return state.changesCommittedPerProject;
  },
  [GET_TOOL_INVOCATIONS_PER_PROJECT]: state => {
    return state.toolInvocationRequestedPerProject;
  },
  [GET_EVENTS_BY_TYPE_FOR_PROJECT]: state => (project_uuid, event_type) => {
    return state.eventsPerProject[project_uuid] && state.eventsPerProject[project_uuid][event_type];
  },
  [GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED]: state => (project_uuid, changes_committed_uuid) => {
    const eventsOfProjectByType = state.eventsPerProject[project_uuid] || {};
    const eventsOfProject = flatten(Object.values(eventsOfProjectByType).map(eventMap => Object.values(eventMap)));
    /** @namespace event.payload.changes_committed_root */
    const eventsOfChangesCommitted = eventsOfProject.filter(event => event.payload.changes_committed_root === changes_committed_uuid);
    eventsOfChangesCommitted.sort((a, b) => (a.meta.created).localeCompare(b.meta.created));
    return eventsOfChangesCommitted;
  },
  [GET_EVENTS]: state => {
    const arrayOfMapTypeVsEvents = Object.values(state.eventsPerProject);
    const arrayOfMapIdEvent = flatten(arrayOfMapTypeVsEvents.map(mie => Object.values(mie)));
    return flatten(arrayOfMapIdEvent.map(ev => Object.values(ev)));
  },
  [GET_EVENTS_UNPROCESSED]: state => {
    const arrayOfEvents = Object.values(state.events);
    return arrayOfEvents.filter(e => e.meta.status === 'UNPROCESSED');
  },
  [GET_EVENTS_PROCESSING]: state => {
    const arrayOfEvents = Object.values(state.events);
    return arrayOfEvents.filter(e => e.meta.status === 'PROCESSING');
  },
};


const actions = {
  async [FETCH_EVENTS_FOR_PROJECT]({ commit }, { event_type, project_uuid }) {
    const {etag, events} = await eventsApi.findAllEventsOfTypeForProject(event_type, project_uuid);
    commit(UPDATE_EVENTS_FOR_PROJECT, {etag, event_type, project_uuid, events});
  },
  async [FETCH_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED]({ commit }, { project_uuid, changes_committed_uuid }) {
    const {events} = await eventsApi.findAllEventsForProjectByChangesCommitted(project_uuid, changes_committed_uuid);
    events.forEach(event => {
      commit(UPDATE_EVENT_FOR_PROJECT, { project_uuid, event });
    });
  },
  [FETCH_EVENTS_UNPROCESSED_AND_PROCESSING]({ dispatch }) {
    return Promise.all([
      eventsApi.findAllUnprocessedEvents().then(events => dispatch(PROCESS_EVENTS, events)),
      eventsApi.findAllProcessingEvents().then(events => dispatch(PROCESS_EVENTS, events)),
    ]);
  },
  async [PROCESS_EVENTS]({ commit }, events) {
    events.forEach(event => {
      commit(UPDATE_EVENT, event);
    });
  },
  async [FETCH_CHANGES_COMMITTED_PER_PROJECT]({ state, commit }) {
    const changesCommittedPerProject = await eventsApi.perProjectEventCountOfType('ChangesCommitted');
    commit(UPDATE_CHANGES_COMMITTED_PER_PROJECT, changesCommittedPerProject);
  },
  async [FETCH_TOOL_INVOCATIONS_PER_PROJECT]({ state, commit }) {
    const toolInvocationRequestedPerProject = await eventsApi.perProjectEventCountOfType('ToolInvocationRequested');
    commit(UPDATE_TOOL_INVOCATIONS_PER_PROJECT, toolInvocationRequestedPerProject);
  }
};


const mutations = {
  [UPDATE_EVENT](state, event) {
    Vue.set(state.events, event.uuid, event)
  },

  [UPDATE_EVENTS_FOR_PROJECT](state, {etag, event_type, project_uuid, events}) {
    if (!state.eventsPerProject[project_uuid]) {
      Vue.set(state.eventsPerProject, project_uuid, {})
    }
    //if (!state.eventsPerProject[project_uuid][event_type] && state.eventsPerProject[project_uuid][event_type].etag !== etag) {
      Vue.set(state.eventsPerProject[project_uuid], event_type, events);
    //  state.eventsPerProject[project_uuid][event_type].etag = etag;
    //}
  },
  [UPDATE_EVENT_FOR_PROJECT](state, { project_uuid, event }) {
    if (!state.eventsPerProject[project_uuid]) {
      Vue.set(state.eventsPerProject, project_uuid, {})
    }
    if (!state.eventsPerProject[project_uuid][event.event_type]) {
      Vue.set(state.eventsPerProject[project_uuid], event.event_type, {})
    }
    Vue.set(state.eventsPerProject[project_uuid][event.event_type], event.uuid, event);
  },
  [UPDATE_CHANGES_COMMITTED_PER_PROJECT](state, changesCommittedPerProject) {
    state.changesCommittedPerProject = changesCommittedPerProject;
  },
  [UPDATE_TOOL_INVOCATIONS_PER_PROJECT](state, toolInvocationRequestedPerProject) {
    state.toolInvocationRequestedPerProject = toolInvocationRequestedPerProject;
  }
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
