module.exports = { 
    toolId: "walkmod-sonar:ArrayDesignatorOnType",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:ArrayDesignatorOnType -i #{filename}",
    toolMeta: {rule: "sonar:ArrayDesignatorOnType"},
    prTitle: "ArrayDesignatorOnType",
    prBody: `
ArrayDesignatorOnType
`
};