import {Ports} from "./types/Ports";
import {fetchModifiedFiles} from "./adapters/fetchModifiedFiles";
import {fetchFirstProjectForCloneUrl} from "node-c3pr-hub-client/projects/fetchFirstProjectForCloneUrl";

const index: Ports = {
    fetchModifiedFiles,
    fetchFirstProjectForCloneUrl
};
export default index;