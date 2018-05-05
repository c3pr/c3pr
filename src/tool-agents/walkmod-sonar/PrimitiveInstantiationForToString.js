module.exports = { 
    toolId: "walkmod-sonar:PrimitiveInstantiationForToString",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:PrimitiveInstantiationForToString -i #{filename}",
    toolMeta: {rule: "sonar:PrimitiveInstantiationForToString"},
    prTitle: "PrimitiveInstantiationForToString",
    prBody: `
PrimitiveInstantiationForToString
`
};