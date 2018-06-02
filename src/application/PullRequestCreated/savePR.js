function savePR(pullRequestCreatedEvent) {

    console.log(`PRC event received`);
    console.log(JSON.stringify(pullRequestCreatedEvent, null, 2));

}

module.exports = savePR;