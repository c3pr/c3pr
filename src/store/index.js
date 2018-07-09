import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import projects, { PROJECTS } from './modules/projects';

export default new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production',

  modules: {
    [PROJECTS]: projects
  }

});
