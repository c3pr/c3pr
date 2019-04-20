import fetchAllToolAgents from "../adapters/fetchAllToolAgents";
import shuffleArray from "../adapters/shuffleArray";
import fetchBlacklistedFiles from "../adapters/fetchBlacklistedFiles";
import retrieveFilesWithOpenPRs from "../adapters/retrieveFilesWithOpenPRs";
import fetchChangedFilesForPullRequestCreatedEvent from "../adapters/fetchChangedFilesForPullRequestCreatedEvent";
import {fetchFirstProjectForCloneUrl} from "node-c3pr-hub-client/projects/fetchFirstProjectForCloneUrl";
import {postNewPrForProject} from "node-c3pr-hub-client/projects/postNewPrForProject";
import {updatePrOfProject} from "node-c3pr-hub-client/projects/updatePrOfProject";

const ports: {
    fetchAllToolAgents;
    shuffleArray;
    fetchBlacklistedFiles;
    retrieveFilesWithOpenPRs;
    fetchChangedFilesForPullRequestCreatedEvent;
    fetchFirstProjectForCloneUrl;
    postNewPrForProject;
    updatePrOfProject;
} = {
    fetchAllToolAgents,
    shuffleArray,
    fetchBlacklistedFiles,
    retrieveFilesWithOpenPRs,
    fetchChangedFilesForPullRequestCreatedEvent,
    fetchFirstProjectForCloneUrl,
    postNewPrForProject,
    updatePrOfProject
};

export default ports;