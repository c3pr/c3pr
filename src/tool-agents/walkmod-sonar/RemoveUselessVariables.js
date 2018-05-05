module.exports = { 
    toolId: "walkmod-sonar:RemoveUselessVariables",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:RemoveUselessVariables -i #{filename}",
    toolMeta: {rule: "sonar:RemoveUselessVariables"},
    prTitle: "RemoveUselessVariables",
    prBody: `
RemoveUselessVariables
`
};