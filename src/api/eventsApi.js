import axios from "../envs";

export default {

  async findAllEvents() {
    const { data: events } = await axios.get('/api/v1/events');
    return events;
  },

  async findAllEventsOfType(event_type) {
    const { data: events } = await axios.get(`/api/v1/events/${event_type}`);
    return events;
  },

  async findAllEventsOfTypeForProject(event_type, project_uuid) {
    const { data: events, headers: { etag } } = await axios.get(`/api/v1/events/${event_type}?payload.project_uuid=${project_uuid}`);
    return {etag, events};
  },

  async findAllEventsForProjectByChangesCommitted(project_uuid, changes_committed_uuid) {
    const { data: events, headers: { etag } } = await axios.get(`/api/v1/events?payload.changes_committed_root=${changes_committed_uuid}`);
    return {etag, events};
  },

  async perProjectEventCountOfType(event_type) {
    const { data: aggregations } = await axios.get(`/api/v1/events/${event_type}/analytics/count-per-project`);
    return aggregations;
  }

}
