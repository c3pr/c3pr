module.exports = { 
    toolId: "walkmod-sonar:UseCollectionIsEmpty",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:UseCollectionIsEmpty",
    toolMeta: {rule: "sonar:UseCollectionIsEmpty"},
    prTitle: "UseCollectionIsEmpty",
    prBody: `
UseCollectionIsEmpty
`
};