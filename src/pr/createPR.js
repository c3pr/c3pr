let stagingFolderName = HASH + uuidv4;

const STAGE_REPOS_FOLDER = '/tmp/';

(async () => {

    const mainRepo = 'https://github.com/c3pr/sample-project-java-maven.git';
    const mainRepoBranch = 'master';

    const forkRepo = `https://github.com/acdcjunior/sample-project-java-maven1.git`;
    const stagingFolder = `${STAGE_REPOS_FOLDER}/${stagingFolderName}`;

    // CREATE FORK, if not exists, via API

    let {error, stdout, stderr} = await sh(`git init ${stagingFolder}`);

    // create brand new orphan branch
    ({error, stdout, stderr} = await sh(`git checkout --orphan ${stagingFolderName}`, {cwd: stagingFolder}));
    // add main repo, fetch it and merge into recently created branch
    ({error, stdout, stderr} = await sh(`git remote add main ${mainRepo}`, {cwd: stagingFolder}));
    ({error, stdout, stderr} = await sh(`git fetch main ${mainRepoBranch}`, {cwd: stagingFolder}));
    ({error, stdout, stderr} = await sh(`git merge main/${mainRepoBranch}`, {cwd: stagingFolder}));

    // APPLY CHANGES
    // APPLY CHANGES
    // APPLY CHANGES

    // add fork repo
    ({error, stdout, stderr} = await sh(`git remote add fork ${forkRepo}`, {cwd: stagingFolder}));
    // push changes
    ({error, stdout, stderr} = await sh(`git push -u fork ${stagingFolderName}`, {cwd: stagingFolder}));

    // CREATE PULL REQUEST VIA API

})();
