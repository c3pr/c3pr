const createForkIfNotExists = require('./createForkIfNotExists');

(async () => {

    try {

        let r = await createForkIfNotExists('sample_user/sample-project-java-maven');
        console.log(JSON.stringify(r));
        // {"organization":"c3pr-bot","forkName":"sample_user__sample-project-java-maven","cloneUrl":"http://d52b4bc956cd/c3pr-bot/sample_user__sample-project-java-maven.git"}

    } catch (e) {
        console.error(e);
    }

})();