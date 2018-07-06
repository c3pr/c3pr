import Vue from 'vue';
import axios from 'axios/index';
import {BACKEND_HUB} from '../envs';

export const PROJECTS = 'PROJECTS';
export const FETCH_PROJECTS = 'FETCH_PROJECTS';
export const FETCH_PROJECT_PRS = 'FETCH_PROJECT_PRS';

export const GET_PROJECTS = 'GET_PROJECTS';

const UPDATE_PROJECTS = 'UPDATE_PROJECTS';
const UPDATE_PROJECT_PRS = 'UPDATE_PROJECT_PRS';

export default {
  namespaced: true,

  state: {
    projects: []
  },

  getters: {
    [GET_PROJECTS]: state => {
      return state.projects
    }
  },

  mutations: {
    [UPDATE_PROJECTS](state, projects) {
      state.projects = projects;
    },
    [UPDATE_PROJECT_PRS](state, {project_uuid, prs}) {
      (state.projects.find(({uuid}) => uuid === project_uuid) || {}).prs = prs;
    }
  },

  actions: {
    async [FETCH_PROJECTS]({ commit, dispatch }) {
      const { data: projects } = await axios.get(BACKEND_HUB + '/api/v1/projects');
      projects.forEach(project => project.prs = []);
      commit(UPDATE_PROJECTS, projects);
      let prs = [];
      for(let project of projects) {
        prs.push(dispatch(FETCH_PROJECT_PRS, project.uuid));
      }
      return Promise.all(prs);
    },
    async [FETCH_PROJECT_PRS]({ commit }, project_uuid) {
      const { data: prs } = await axios.get(BACKEND_HUB + '/api/v1/projects/' + project_uuid + '/prs');
      commit(UPDATE_PROJECT_PRS, {project_uuid, prs});
    }
  }
};
