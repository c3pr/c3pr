module.exports = { 
    toolId: "walkmod-sonar:RemoveUnusedMethodParameters",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:RemoveUnusedMethodParameters -i #{filename}",
    toolMeta: {rule: "sonar:RemoveUnusedMethodParameters"},
    prTitle: "RemoveUnusedMethodParameters",
    prBody: `
RemoveUnusedMethodParameters
`
};