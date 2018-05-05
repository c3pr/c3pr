module.exports = { 
    toolId: "walkmod-sonar:CollapsibleIfStatements",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:CollapsibleIfStatements -i #{filename}",
    toolMeta: {rule: "sonar:CollapsibleIfStatements"},
    prTitle: "CollapsibleIfStatements",
    prBody: `
CollapsibleIfStatements
`
};