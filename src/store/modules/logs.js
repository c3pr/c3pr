import logsApi from "../../api/logsApi";

export const LOGS = 'LOGS';

export const FETCH_LOGS_FOR_EUUID = 'FETCH_LOGS_FOR_EUUID';
export const FETCH_LOGS_FOR_LCID = 'FETCH_LOGS_FOR_LCID';
export const FETCH_LOGS_FOR_SHA = 'FETCH_LOGS_FOR_SHA';

export const GET_LOGS = 'GET_LOGS';

const UPDATE_LOGS = 'UPDATE_LOGS';


const state = {
  logs: []
};


const getters = {
  [GET_LOGS]: state => {
    return state.logs;
  }
};


async function fetchLogs(commit, fetchFn) {
  commit(UPDATE_LOGS, []);
  const logs = await fetchFn();
  logs.sort((a, b) => a.date_time.localeCompare(b.date_time));
  commit(UPDATE_LOGS, logs);
}

const actions = {
  [FETCH_LOGS_FOR_EUUID]({ commit }, euuid) {
    return fetchLogs(commit, () => logsApi.findForEuuid(euuid));
  },
  [FETCH_LOGS_FOR_LCID]({ commit }, lcid) {
    return fetchLogs(commit, () => logsApi.findForLcid(lcid));
  },
  [FETCH_LOGS_FOR_SHA]({ commit }, sha) {
    return fetchLogs(commit, () => logsApi.findForSha(sha));
  }
};


const mutations = {
  [UPDATE_LOGS](state, logs) {
    state.logs = logs;
  }
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
