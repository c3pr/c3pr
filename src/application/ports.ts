import shuffleArray from "../adapters/shuffleArray";
import fetchChangedFilesForPullRequestCreatedEvent from "../adapters/fetchChangedFilesForPullRequestCreatedEvent";
import {postNewPrForProject} from "node-c3pr-hub-client/projects/postNewPrForProject";

const ports: {
    shuffleArray;
    fetchChangedFilesForPullRequestCreatedEvent;
    postNewPrForProject;
} = {
    shuffleArray,
    fetchChangedFilesForPullRequestCreatedEvent,
    postNewPrForProject
};

export default ports;