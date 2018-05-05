module.exports = { 
    toolId: "walkmod-sonar:AddSwitchDefaultCase",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:AddSwitchDefaultCase -i #{filename}",
    toolMeta: {rule: "sonar:AddSwitchDefaultCase"},
    prTitle: "AddSwitchDefaultCase",
    prBody: `
AddSwitchDefaultCase
`
};