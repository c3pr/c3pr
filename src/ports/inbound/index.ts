import { handlePullRequestRequested } from '../../application/PullRequestRequested/handlePullRequestRequested';
import {handleWebhook} from "../../application/handleWebhook/handleWebhook";
import {InboundPorts} from "./InboundPorts";





const inboundPorts: InboundPorts = {
    handlePullRequestRequested,
    handleWebhook
};
// noinspection JSUnusedGlobalSymbols
export default inboundPorts;