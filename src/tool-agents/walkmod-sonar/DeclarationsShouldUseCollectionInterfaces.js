module.exports = { 
    toolId: "walkmod-sonar:DeclarationsShouldUseCollectionInterfaces",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:DeclarationsShouldUseCollectionInterfaces",
    toolMeta: {rule: "sonar:DeclarationsShouldUseCollectionInterfaces"},
    prTitle: "DeclarationsShouldUseCollectionInterfaces",
    prBody: `
DeclarationsShouldUseCollectionInterfaces
`
};