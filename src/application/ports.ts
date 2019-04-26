import fetchAllToolAgents from "../adapters/fetchAllToolAgents";
import shuffleArray from "../adapters/shuffleArray";
import fetchProjectFiles from "../adapters/fetchProjectFiles";
import retrieveFilesWithOpenPRs from "../adapters/retrieveFilesWithOpenPRs";
import fetchChangedFilesForPullRequestCreatedEvent from "../adapters/fetchChangedFilesForPullRequestCreatedEvent";
import {fetchFirstProjectForCloneUrl} from "node-c3pr-hub-client/projects/fetchFirstProjectForCloneUrl";
import {postNewPrForProject} from "node-c3pr-hub-client/projects/postNewPrForProject";
import {updatePrOfProject} from "node-c3pr-hub-client/projects/updatePrOfProject";

const ports: {
    fetchAllToolAgents;
    shuffleArray;
    fetchProjectFiles;
    retrieveFilesWithOpenPRs;
    fetchChangedFilesForPullRequestCreatedEvent;
    fetchFirstProjectForCloneUrl;
    postNewPrForProject;
    updatePrOfProject;
} = {
    fetchAllToolAgents,
    shuffleArray,
    fetchProjectFiles,
    retrieveFilesWithOpenPRs,
    fetchChangedFilesForPullRequestCreatedEvent,
    fetchFirstProjectForCloneUrl,
    postNewPrForProject,
    updatePrOfProject
};

export default ports;