import Vue from 'vue';
import eventsApi from "../../api/eventsApi";

export const EVENTS = 'EVENTS';
export const FETCH_ALL_EVENTS = 'FETCH_ALL_EVENTS';
export const FETCH_EVENTS_FOR_PROJECT = 'FETCH_EVENTS_FOR_PROJECT';
export const FETCH_CHANGES_COMMITTED_PER_PROJECT = 'FETCH_CHANGES_COMMITTED_PER_PROJECT';

export const GET_ALL_EVENTS = 'GET_ALL_EVENTS';
export const GET_EVENTS_BY_TYPE_FOR_PROJECT = 'GET_EVENTS_BY_TYPE_FOR_PROJECT';
export const GET_CHANGES_COMMITTED_PER_PROJECT = 'GET_CHANGES_COMMITTED_PER_PROJECT';

export const UPDATE_ALL_EVENTS = 'UPDATE_ALL_EVENTS';
export const UPDATE_EVENTS_FOR_PROJECT = 'UPDATE_EVENTS_FOR_PROJECT';
export const UPDATE_CHANGES_COMMITTED_PER_PROJECT = 'UPDATE_CHANGES_COMMITTED_PER_PROJECT';


const state = {
  eventType: 'ChangesCommitted',
  events: [],
  changesCommittedPerProject: [],
  eventsPerProject: {}
};


const getters = {
  [GET_ALL_EVENTS]: state => {
    return state.events;
  },
  [GET_CHANGES_COMMITTED_PER_PROJECT]: state => {
    return state.changesCommittedPerProject;
  },
  [GET_EVENTS_BY_TYPE_FOR_PROJECT]: state => (project_uuid, event_type) => {
    return state.eventsPerProject[project_uuid] && state.eventsPerProject[project_uuid][event_type];
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
