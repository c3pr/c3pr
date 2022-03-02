import axios from "../envs";

export default {

  async findForEuuid(euuid) {
    const { data: logs } = await axios.get(`/api/v1/logs?euuid=${euuid}`);
    return logs;
  },

  async findForLcid(lcid) {
    const { data: logs } = await axios.get(`/api/v1/logs?lcid=${lcid}`);
    return logs;
  },

  async findForSha(sha) {
    const { data: logs } = await axios.get(`/api/v1/logs?sha=${sha}`);
    return logs;
  },

  async findForService(serviceName, date) {
    const { data: logs } = await axios.get(`/api/v1/logs/service/${serviceName}?date=${date}`);
    return logs;
  }

}
