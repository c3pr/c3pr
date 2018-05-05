module.exports = { 
    toolId: "walkmod-sonar:RemoveEmptyStatement",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:RemoveEmptyStatement -i #{filename}",
    toolMeta: {rule: "sonar:RemoveEmptyStatement"},
    prTitle: "RemoveEmptyStatement",
    prBody: `
RemoveEmptyStatement
`
};