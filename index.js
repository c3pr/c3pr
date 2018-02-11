module.exports = {
    cloneRepositoryLocally: require('./src/cloneRepositoryLocally'),
    determineGitDiff: require('./src/determineGitDiff'),
    shell: require('./src/shell').shell,
    shellOut: require('./src/shell').shellOut
};