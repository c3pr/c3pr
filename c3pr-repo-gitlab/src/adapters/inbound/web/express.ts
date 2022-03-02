import * as express from 'express';
import * as bodyParser from 'body-parser';

import config from '../../../config';
import c3prHubListenerController from "./c3prHubListenerController";
import webhooksController from "./webhooksController";
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";

const app = express();

app.use(express.static('resources/public'));

app.use(bodyParser.json());

c3prHubListenerController(app);
webhooksController(app);

app.get('*', function(req, res){
    // The 404 Route (ALWAYS Keep this as the last route)
    res.status(404).send(`No C3PR endpoint is listening at ${req.url}.`);
});

app.listen(config.c3pr.repoGitlab.c3prRepoGitlabPort, '0.0.0.0', () => {
    const _c3prLOG5 = c3prLOG5({sha: '!express-gitlab-init'});
    _c3prLOG5(`
c3pr-repo-gitlab now listening at port ${config.c3pr.repoGitlab.c3prRepoGitlabPort}.

c3pr-repo-gitlab webhooks URL will be: ${config.c3pr.repoGitlab.c3prRepoGitlabUrl + config.c3pr.repoGitlab.webhooksUrl}

c3pr's git username and email are: '${config.c3pr.repoGitlab.gitlab.botUserName.replace(/'/g, '')}' <'${config.c3pr.repoGitlab.gitlab.botUserEmail.replace(/'/g, '')}'>
`);
    _c3prLOG5(`C-3PR GitLab-Repo-Adapter is up at ${config.c3pr.repoGitlab.c3prRepoGitlabUrl}.`);
});
