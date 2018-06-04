import {createMergeRequest} from "./createMergeRequest";

(async () => {

    try {

        /*
        NOTE: this requires the existence of the c3pr-bot/sample_user__sample-project-java-maven project and a commit in the prCreationTestBranch.
         */

        let r = await createMergeRequest(
            'sample_user/sample-project-java-maven',
            'master',
            'c3pr-bot',
            'sample_user__sample-project-java-maven',
            'prCreationTestBranch',
            'my pr title',
            'my pr `desc`',
            {id: 1, username: 'root'}
        );
        console.log(JSON.stringify(r));


    } catch (e) {
        console.error(e.response.data);
    }

})();