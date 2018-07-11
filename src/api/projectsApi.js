import axios from "../envs";

export default {

  async findAllProjects() {
    const { data: projects } = await axios.get('/api/v1/projects');
    return projects;
  },

  async findPrsForProject(project_uuid) {
    const { data: prs } = await axios.get('/api/v1/projects/' + project_uuid + '/prs');
    return prs;
  }

}
