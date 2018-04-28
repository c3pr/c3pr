module.exports = { 
    toolId: "walkmod-sonar:StaticInitializedFieldToFinal",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:StaticInitializedFieldToFinal",
    toolMeta: {rule: "sonar:StaticInitializedFieldToFinal"},
    prTitle: "StaticInitializedFieldToFinal",
    prBody: `
StaticInitializedFieldToFinal
`
};