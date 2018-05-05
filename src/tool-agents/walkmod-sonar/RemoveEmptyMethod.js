module.exports = { 
    toolId: "walkmod-sonar:RemoveEmptyMethod",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:RemoveEmptyMethod -i #{filename}",
    toolMeta: {rule: "sonar:RemoveEmptyMethod"},
    prTitle: "RemoveEmptyMethod",
    prBody: `
RemoveEmptyMethod
`
};