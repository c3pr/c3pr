module.exports = { 
    toolId: "walkmod-sonar:RemoveCodeComment",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:RemoveCodeComment",
    toolMeta: {rule: "sonar:RemoveCodeComment"},
    prTitle: "RemoveCodeComment",
    prBody: `
RemoveCodeComment
`
};