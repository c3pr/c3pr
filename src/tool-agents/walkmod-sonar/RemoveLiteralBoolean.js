module.exports = { 
    toolId: "walkmod-sonar:RemoveLiteralBoolean",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:RemoveLiteralBoolean -i #{filename}",
    toolMeta: {rule: "sonar:RemoveLiteralBoolean"},
    prTitle: "RemoveLiteralBoolean",
    prBody: `
RemoveLiteralBoolean
`
};