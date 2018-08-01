import Vue from 'vue';
import eventsApi from "../../api/eventsApi";

export const EVENTS = 'EVENTS';
export const FETCH_ALL_EVENTS = 'FETCH_ALL_EVENTS';
export const FETCH_EVENTS_FOR_PROJECT = 'FETCH_EVENTS_FOR_PROJECT';
export const FETCH_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED = 'FETCH_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED';
export const FETCH_CHANGES_COMMITTED_PER_PROJECT = 'FETCH_CHANGES_COMMITTED_PER_PROJECT';

export const GET_ALL_EVENTS = 'GET_ALL_EVENTS';
export const GET_EVENTS_BY_TYPE_FOR_PROJECT = 'GET_EVENTS_BY_TYPE_FOR_PROJECT';
export const GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED = 'GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED';
export const GET_CHANGES_COMMITTED_PER_PROJECT = 'GET_CHANGES_COMMITTED_PER_PROJECT';

export const UPDATE_ALL_EVENTS = 'UPDATE_ALL_EVENTS';
export const UPDATE_EVENT_FOR_PROJECT = 'UPDATE_EVENT_FOR_PROJECT';
export const UPDATE_EVENTS_FOR_PROJECT = 'UPDATE_EVENTS_FOR_PROJECT';
export const UPDATE_CHANGES_COMMITTED_PER_PROJECT = 'UPDATE_CHANGES_COMMITTED_PER_PROJECT';


const state = {
  eventType: 'ChangesCommitted',
  events: [],
  changesCommittedPerProject: [],
  eventsPerProject: {
    /*
    "6068bb20-6145-4e3c-a9d3-2096fd2db24b": { // project key
      "ChangesCommitted": {
        "7d7f223c-649f-42e5-89c5-7aa04bfe41c8": {}
      }
    }
    */
  }
};

function flatten(arrayOfArrays) {
  return [].concat.apply([], arrayOfArrays);
}

const getters = {
  [GET_ALL_EVENTS]: state => {
    return state.events;
  },
  [GET_CHANGES_COMMITTED_PER_PROJECT]: state => {
    return state.changesCommittedPerProject;
  },
  [GET_EVENTS_BY_TYPE_FOR_PROJECT]: state => (project_uuid, event_type) => {
    return state.eventsPerProject[project_uuid] && state.eventsPerProject[project_uuid][event_type];
  },
  [GET_EVENTS_FOR_PROJECT_BY_CHANGES_COMMITTED]: state => (project_uuid, changes_committed_uuid) => {
    const eventsOfProjectByType = state.eventsPerProject[project_uuid] || {};
    const eventsOfProject = flatten(Object.values(eventsOfProjectByType).map(eventMap => Object.values(eventMap)));
    const eventsOfChangesCommitted = eventsOfProject.filter(event => event.payload.changes_committed_root === changes_committed_uuid);
    eventsOfChangesCommitted.sort((a, b) => a.meta.modified.localeCompare(b.meta.modified));
    return eventsOfChangesCommitted;
  }
};


const actions = {
  async [FETCH_ALL_EVENTS]({ state, commit }) {
    const events = await eventsApi.findAllEventsOfType(state.eventType);
    commit(UPDATE_ALL_EVENTS, events);
  },
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
  async [FETCH_CHANGES_COMMITTED_PER_PROJECT]({ state, commit }) {
    const changesCommittedPerProject = await eventsApi.perProjectEventCountOfType('ChangesCommitted');
    commit(UPDATE_CHANGES_COMMITTED_PER_PROJECT, changesCommittedPerProject);
  }
};


const mutations = {
  [UPDATE_ALL_EVENTS](state, events) {
    state.events = events;
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
  }
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
