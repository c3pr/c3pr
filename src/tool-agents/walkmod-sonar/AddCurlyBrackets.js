module.exports = { 
    toolId: "walkmod-sonar:AddCurlyBrackets",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:AddCurlyBrackets",
    toolMeta: {rule: "sonar:AddCurlyBrackets"},
    prTitle: "AddCurlyBrackets",
    prBody: `
AddCurlyBrackets
`
};