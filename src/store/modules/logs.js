import logsApi from "../../api/logsApi";

export const LOGS = 'LOGS';

export const FETCH_LOGS_FOR_EVENT = 'FETCH_LOGS_FOR_EVENT';

export const GET_LOGS_FOR_EVENT = 'GET_LOGS_FOR_EVENT';

export const UPDATE_LOGS_FOR_EVENT = 'UPDATE_LOGS_FOR_EVENT';


const state = {
  logs: []
};


const getters = {
  [GET_LOGS_FOR_EVENT]: state => {
    return state.logs;
  }
};


const actions = {
  async [FETCH_LOGS_FOR_EVENT]({ commit }, euuid) {
    commit(UPDATE_LOGS_FOR_EVENT, []);

    const logsByEuuid = await logsApi.findForEuuid(euuid);

    let logsMap = {};
    let lcids = {};
    logsByEuuid.forEach(log => {
      logsMap[log._id] = log;
      lcids[log.lcid] = true;
    });

    for(let lcid of Object.keys(lcids)) {
      const logsByLcid = await logsApi.findForLcid(lcid);
      logsByLcid.forEach(log => {
        logsMap[log._id] = log;
      });
    }

    const logs = Object.values(logsMap);
    logs.sort((a, b) => a.date_time.localeCompare(b.date_time));

    commit(UPDATE_LOGS_FOR_EVENT, logs);
  }
};


const mutations = {
  [UPDATE_LOGS_FOR_EVENT](state, logs) {
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
