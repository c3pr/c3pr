import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard.vue';
import LogsForEuuid from './views/LogsForEuuid.vue';
import Hub from './views/Hub.vue';
import Projects from './views/Projects.vue';
import Events from './views/Events.vue';
import EventsPerProject from './views/EventsPerProject.vue';
import EventsPerProjectPerChangesCommitted from './views/EventsPerProjectPerChangesCommitted.vue';
import ProjectDetails from './views/ProjectDetails.vue';
import EventByUuid from "./views/EventByUuid";
import LogsForService from "./views/LogsForService";
import Latex from "./views/Latex";
import LogsForLcid from "./views/LogsForLcid";
import LogsForSha from "./views/LogsForSha";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/logs/euuid/:euuid',
      name: 'logs-euuid',
      component: LogsForEuuid,
      props: true
    },
    {
      path: '/logs/lcid/:lcid',
      name: 'logs-lcid',
      component: LogsForLcid,
      props: true
    },
    {
      path: '/logs/sha/:sha',
      name: 'logs-sha',
      component: LogsForSha,
      props: true
    },
    {
      path: '/hub',
      name: 'hub',
      component: Hub,
    },
    {
      path: '/logs',
      name: 'logs',
      component: LogsForService,
    },
    {
      path: '/latex',
      name: 'latex',
      component: Latex,
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
      path: '/events/:uuid',
      name: 'event-by-uuid',
      component: EventByUuid,
      props: true
    },
    {
      path: '/events/project/:project_uuid',
      name: 'events-per-project',
      component: EventsPerProject,
      props: true
    },
    {
      path: '/events/project/:project_uuid/change/:changes_committed_uuid',
      name: 'events-per-project-per-changes-committed',
      component: EventsPerProjectPerChangesCommitted,
      props: true
    },
    {
      path: '/project/:projectId/details',
      name: 'project-details',
      component: ProjectDetails,
      props: true,
    }
  ],
});
