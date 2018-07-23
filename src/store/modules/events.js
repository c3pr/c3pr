import eventsApi from "../../api/eventsApi";

export const EVENTS = 'EVENTS';
export const FETCH_ALL_EVENTS = 'FETCH_ALL_EVENTS';
export const FETCH_CHANGES_COMMITTED_PER_PROJECT = 'FETCH_CHANGES_COMMITTED_PER_PROJECT';

export const GET_ALL_EVENTS = 'GET_ALL_EVENTS';
export const GET_CHANGES_COMMITTED_PER_PROJECT = 'GET_CHANGES_COMMITTED_PER_PROJECT';

export const UPDATE_ALL_EVENTS = 'UPDATE_ALL_EVENTS';
export const UPDATE_CHANGES_COMMITTED_PER_PROJECT = 'UPDATE_CHANGES_COMMITTED_PER_PROJECT';


const state = {
  eventType: 'ChangesCommitted',
  events: [],
  changesCommittedPerProject: []
};


const getters = {
  [GET_ALL_EVENTS]: state => {
    return state.events;
  },
  [GET_CHANGES_COMMITTED_PER_PROJECT]: state => {
    return state.changesCommittedPerProject;
  }
};


const actions = {
  async [FETCH_ALL_EVENTS]({ state, commit }) {
    const events = await eventsApi.findAllEventsOfType(state.eventType);
    commit(UPDATE_ALL_EVENTS, events);
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
