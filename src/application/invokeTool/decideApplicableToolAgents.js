const filterApplicableToolAgents = require('./filterApplicableToolAgents');

function __shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function decideApplicableToolAgents(toolAgents, files) {
    const applicableToolAgents = filterApplicableToolAgents(toolAgents, files);
    decideApplicableToolAgents.__shuffleArray(applicableToolAgents);
    return applicableToolAgents;
}
// exposed for testing
decideApplicableToolAgents.__shuffleArray = __shuffleArray;

module.exports = decideApplicableToolAgents;