import Vue from 'vue';
import projectsApi from "../../api/projectsApi";

export const PROJECTS = 'PROJECTS';
export const FETCH_ALL_PROJECTS = 'FETCH_ALL_PROJECTS';
export const FETCH_PRS_FOR_ALL_PROJECTS = 'FETCH_PRS_FOR_ALL_PROJECTS';
export const FETCH_PRS_FOR_PROJECT = 'FETCH_PRS_FOR_PROJECT';

export const GET_ALL_PROJECTS = 'GET_ALL_PROJECTS';

export const UPDATE_ALL_PROJECTS = 'UPDATE_ALL_PROJECTS';
export const UPDATE_PRS_FOR_PROJECT = 'UPDATE_PRS_FOR_PROJECT';


const state = {
  projects: [],
  prs: {}
};


const getters = {
  [GET_ALL_PROJECTS]: state => {
    return state.projects.map(project => ({...project, prs: state.prs[project.uuid] || []}));
  }
};


const actions = {
  async [FETCH_ALL_PROJECTS]({ commit, dispatch }) {
    const projects = await projectsApi.findAllProjects();
    commit(UPDATE_ALL_PROJECTS, projects);

    return dispatch(FETCH_PRS_FOR_ALL_PROJECTS);
  },

  async [FETCH_PRS_FOR_ALL_PROJECTS]({ state, commit, dispatch }) {
    return Promise.all(state.projects.map(project => dispatch(FETCH_PRS_FOR_PROJECT, project.uuid)));
  },

  async [FETCH_PRS_FOR_PROJECT]({ commit }, project_uuid) {
    const prs = await projectsApi.findPrsForProject(project_uuid);
    commit(UPDATE_PRS_FOR_PROJECT, {project_uuid, prs});
  }
};


const mutations = {
  [UPDATE_ALL_PROJECTS](state, projects) {
    state.projects = projects;
  },

  [UPDATE_PRS_FOR_PROJECT](state, {project_uuid, prs}) {
    prs._open = prs.filter(({status}) => status === "open").length;
    prs._merged = prs.filter(({status}) => status === "merged").length;
    prs._closed = prs.filter(({status}) => status === "closed").length;
    Vue.set(state.prs, project_uuid, prs);
  }
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
