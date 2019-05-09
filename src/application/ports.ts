import shuffleArray from "../adapters/shuffleArray";
import fetchChangedFilesForPullRequestCreatedEvent from "../adapters/fetchChangedFilesForPullRequestCreatedEvent";
import {fetchFirstProjectForCloneUrl} from "node-c3pr-hub-client/projects/fetchFirstProjectForCloneUrl";
import {postNewPrForProject} from "node-c3pr-hub-client/projects/postNewPrForProject";
import {updatePrOfProject} from "node-c3pr-hub-client/projects/updatePrOfProject";

const ports: {
    shuffleArray;
    fetchChangedFilesForPullRequestCreatedEvent;
    fetchFirstProjectForCloneUrl;
    postNewPrForProject;
    updatePrOfProject;
} = {
    shuffleArray,
    fetchChangedFilesForPullRequestCreatedEvent,
    fetchFirstProjectForCloneUrl,
    postNewPrForProject,
    updatePrOfProject
};

export default ports;