import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard.vue';
import Logs from './views/Logs.vue';
import Hub from './views/Hub.vue';
import Projects from './views/Projects.vue';
import Events from './views/Events.vue';
import EventsPerProject from './views/EventsPerProject.vue';
import Details from './views/Details.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/logs',
      name: 'logs',
      component: Logs,
    },
    {
      path: '/hub',
      name: 'hub',
      component: Hub,
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
    },
    {
      path: '/events',
      name: 'events',
      component: Events,
    },
    {
      path: '/events/:project_uuid',
      name: 'events-per-project',
      component: EventsPerProject,
    },
    {
      path: '/project/:projectId/details',
      name: 'details',
      component: Details,
      props: true,
    }
  ],
});
