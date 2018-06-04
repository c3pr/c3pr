import { InboundPorts } from "./InboundPorts";
import { c3prRepoGitLabLogin } from "../../application/login/login";
import { handlePullRequestRequested } from '../../application/PullRequestRequested/handlePullRequestRequested';
import { handleWebhook } from "../../application/handleWebhook/handleWebhook";


const inboundPorts: InboundPorts = {
    c3prRepoGitLabLogin,
    handlePullRequestRequested,
    handleWebhook
};
// noinspection JSUnusedGlobalSymbols
export default inboundPorts;