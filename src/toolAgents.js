const toolAgents = {
    agents: [
        // {
        //     toolId: "test-tool",
        //     extensions: ["java", "xml", "txt", "json"],
        //     agentURL: "http://localhost:5003/c3pr",
        //     command: "echo example-test-tool>test-file.txt",
        //     toolMeta: {}, // unused
        //     prTitle: "My Test Tool PR Title",
        //     prBody: "This is the *markdown* body."
        // },
    ].concat(
        require('./tool-agents/walkmod-sonar'),
    )
};

module.exports = toolAgents;