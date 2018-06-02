import {HubClient} from "./types/HubClient";
import {_fetchProjectUuidForCloneUrl as fetchProjectUuidForCloneUrl} from "./adapters/fetchProjectUuidForCloneUrl";

const index: HubClient = {
    fetchProjectUuidForCloneUrl
};
export default index;