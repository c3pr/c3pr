module.exports = { 
    toolId: "walkmod-sonar:LocalVarsShouldComplyWithNamingConvention",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:LocalVarsShouldComplyWithNamingConvention",
    toolMeta: {rule: "sonar:LocalVarsShouldComplyWithNamingConvention"},
    prTitle: "LocalVarsShouldComplyWithNamingConvention",
    prBody: `
LocalVarsShouldComplyWithNamingConvention
`
};