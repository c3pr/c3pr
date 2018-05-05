module.exports = { 
    toolId: "walkmod-sonar:RemoveUselessImports",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:RemoveUselessImports -i #{filename}",
    toolMeta: {rule: "sonar:RemoveUselessImports"},
    prTitle: "RemoveUselessImports",
    prBody: `
RemoveUselessImports
`
};