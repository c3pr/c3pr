import {HubClient} from './types/HubClient';
import _hubClientConfig from './hubClientConfig'
import {_fetchProjectUuidForCloneUrl as fetchProjectUuidForCloneUrl} from "./adapters/fetchProjectUuidForCloneUrl";

const index: HubClient = {
    fetchProjectUuidForCloneUrl
};
export default index;

export const hubClientConfig = _hubClientConfig;