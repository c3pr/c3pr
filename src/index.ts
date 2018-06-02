import {HubClient} from './types/HubClient';
import {fetchProjectUuidForCloneUrl} from "./adapters/fetchProjectUuidForCloneUrl";

const index: HubClient = {
    fetchProjectUuidForCloneUrl
};
export default index;