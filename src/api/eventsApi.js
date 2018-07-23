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

  async perProjectEventCountOfType(event_type) {
    const { data: aggregations } = await axios.get(`/api/v1/events/${event_type}/analytics/count-per-project`);
    return aggregations;
  }

}
