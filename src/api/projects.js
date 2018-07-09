import {BACKEND_HUB} from "../envs";
import axios from "axios";

export default {

  async findAllProjects() {
    const { data: projects } = await axios.get(BACKEND_HUB + '/api/v1/projects');
    return projects;
  },

  async findPrsForProject(project_uuid) {
    const { data: prs } = await axios.get(BACKEND_HUB + '/api/v1/projects/' + project_uuid + '/prs');
    return prs;
  }

}
