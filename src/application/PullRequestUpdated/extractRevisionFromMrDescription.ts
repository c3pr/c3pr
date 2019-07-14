const Sentry = require('@sentry/node');

function isNotGitSha(revision) {
    return !/^[a-z0-9]{40}$/.test(revision);
}

export default function extractRevisionFromMrDescription(description: string) {
    // Expected message format: "dfasdfasdffd This fix was generated in response to the commit 5aeb86edb4a17cb985c13a4db14a4b66064ef94b.".match(/(\w+)\.$/)[1]
    const revision = description.match(/(\w+)\.$/)[1];
    if (isNotGitSha(revision)) {
        const message = `Got invalid revision (${revision}) from MR description: ${description}`;
        console.log(message);
        Sentry.captureMessage(message);
    }
    return revision;
}