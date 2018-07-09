import Vue from 'vue';
import projectsApi from "../../api/projects";

export const PROJECTS = 'PROJECTS';
export const FETCH_ALL_PROJECTS = 'FETCH_ALL_PROJECTS';
export const FETCH_PRS_FOR_ALL_PROJECTS = 'FETCH_PRS_FOR_ALL_PROJECTS';
export const FETCH_PRS_FOR_PROJECT = 'FETCH_PRS_FOR_PROJECT';

export const GET_ALL_PROJECTS = 'GET_ALL_PROJECTS';

const UPDATE_PROJECTS = 'UPDATE_PROJECTS';
const UPDATE_PROJECT_PRS = 'UPDATE_PROJECT_PRS';


const state = {
  projects: [],
  prs: {}
};


const getters = {
  [GET_ALL_PROJECTS]: state => {
    return state.projects.map(project => ({...project, prs: state.prs[project.uuid]}));
  }
};


const actions = {
  async [FETCH_ALL_PROJECTS]({ commit, dispatch }) {
    const projects = await projectsApi.findAllProjects();
    commit(UPDATE_PROJECTS, projects);

    return dispatch(FETCH_PRS_FOR_ALL_PROJECTS);
  },

  async [FETCH_PRS_FOR_ALL_PROJECTS]({ state, commit, dispatch }) {
    return Promise.all(state.projects.map(project => dispatch(FETCH_PRS_FOR_PROJECT, project.uuid)));
  },

  async [FETCH_PRS_FOR_PROJECT]({ commit }, project_uuid) {
    const prs = await projectsApi.findPrsForProject(project_uuid);
    commit(UPDATE_PROJECT_PRS, {project_uuid, prs});
  }
};


const mutations = {
  [UPDATE_PROJECTS](state, projects) {
    state.projects = projects;
  },

  [UPDATE_PROJECT_PRS](state, {project_uuid, prs}) {
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
