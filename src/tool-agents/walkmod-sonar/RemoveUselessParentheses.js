module.exports = { 
    toolId: "walkmod-sonar:RemoveUselessParentheses",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:RemoveUselessParentheses -i #{filename}",
    toolMeta: {rule: "sonar:RemoveUselessParentheses"},
    prTitle: "RemoveUselessParentheses",
    prBody: `
RemoveUselessParentheses
`
};