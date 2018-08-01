import axios from "../envs";

export default {

  async findForEuuid(euuid) {
    const { data: logs } = await axios.get(`/api/v1/logs/euuid/${euuid}`);
    return logs;
  },

  async findForLcid(lcid) {
    const { data: logs } = await axios.get(`/api/v1/logs/lcid/${lcid}`);
    return logs;
  }

}
