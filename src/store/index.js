import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import projects, { PROJECTS } from './modules/projects';
import events, { EVENTS } from './modules/events';

export default new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production',

  modules: {
    [PROJECTS]: projects,
    [EVENTS]: events
  }

});
