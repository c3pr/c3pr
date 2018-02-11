const toolAgents = {
    agents: [
        {
            toolId: "test-tool",
            extensions: ["java", "xml", "txt", "json"],
            agentURL: "http://localhost:5002/c3pr",
            command: "echo example-test-tool>test-file.txt"
            //, toolMeta: {}
        },
        {
            toolId: "walkmod-sonar:StringCheckOnLeft",
            extensions: ["javaREMOVE-ME"],
            agentURL: "http://some-server-running-walkmod-docker.com:5000/c3pr",
            command: "walkmod apply sonar:StringCheckOnLeft",
            toolMeta: {rule: "sonar:StringCheckOnLeft"}
        }
    ]
};

module.exports = toolAgents;