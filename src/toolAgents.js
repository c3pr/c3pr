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
        {
            toolId: "walkmod-sonar:StringCheckOnLeft",
            extensions: ["java"],
            // agentURL: "http://some-server-running-walkmod-docker.com:5000/c3pr",
            // agentURL: "http://localhost:5003/c3pr",
            agentURL: "http://189.6.108.114:5003/c3pr",
            command: "walkmod apply sonar:StringCheckOnLeft",
            toolMeta: {rule: "sonar:StringCheckOnLeft"},
            prTitle: "My PR Title",
            prBody: "This is the `markdown` body."
        }
    ]
};

module.exports = toolAgents;