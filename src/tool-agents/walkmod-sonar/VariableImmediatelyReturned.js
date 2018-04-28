module.exports = { 
    toolId: "walkmod-sonar:VariableImmediatelyReturned",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:VariableImmediatelyReturned",
    toolMeta: {rule: "sonar:VariableImmediatelyReturned"},
    prTitle: "VariableImmediatelyReturned",
    prBody: `
VariableImmediatelyReturned
`
};