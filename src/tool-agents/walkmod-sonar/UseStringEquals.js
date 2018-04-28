module.exports = { 
    toolId: "walkmod-sonar:UseStringEquals",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:UseStringEquals",
    toolMeta: {rule: "sonar:UseStringEquals"},
    prTitle: "UseStringEquals",
    prBody: `
UseStringEquals
`
};