import {createComment} from "./createComment";

const fakeLog = (...a) => { console.log(...a); return fakeLog; };

(async () => {

    try {

        let r = await createComment(
            'root/renames',
            4,
            `Hey @root, thanks for taking the time to review my suggestion!

    Would you take an extra time and help me understand why this merge request was rejected?

    If you somehow found it useful but decided to take action (like doing the refactoring a bit differently) yourself,
    let me know by saying \`@c3pr-bot manual\`.

    If, on the other hand, you don't like this transformation and wish to disable it
    for this file or for the whole project, use \`@c3pr-bot disable for file\` or \`@c3pr-bot disable for project\`.

    Lastly, if you are interested in knowing all available options, just try \`@c3pr-bot help\`.`,
            fakeLog
        );
        console.log(JSON.stringify(r.data));


    } catch (e) {
        console.error(e);
    }

})();