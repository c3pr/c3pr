import {Ports} from "./types/Ports";
import {_fetchModifiedFiles as fetchModifiedFiles} from "./adapters/fetchModifiedFiles";
import {_fetchProjectUuidForCloneUrl as fetchProjectUuidForCloneUrl} from "./adapters/fetchProjectUuidForCloneUrl";

const index: Ports = {
    fetchModifiedFiles,
    fetchProjectUuidForCloneUrl
};
export default index;