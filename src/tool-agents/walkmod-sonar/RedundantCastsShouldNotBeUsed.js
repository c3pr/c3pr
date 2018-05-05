module.exports = { 
    toolId: "walkmod-sonar:RedundantCastsShouldNotBeUsed",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:RedundantCastsShouldNotBeUsed -i #{filename}",
    toolMeta: {rule: "sonar:RedundantCastsShouldNotBeUsed"},
    prTitle: "RedundantCastsShouldNotBeUsed",
    prBody: `
RedundantCastsShouldNotBeUsed
`
};