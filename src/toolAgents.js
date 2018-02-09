const toolAgents = {
    agents: [
        {
            toolId: "walkmod-sonar:StringCheckOnLeft",
            extensions: ["java"],
            // agentURL: "http://some-server-running-walkmod-docker.com:5000/c3pr",
            agentURL: "http://localhost:5002/c3pr",
            command: "walkmod apply sonar:StringCheckOnLeft",
            toolMeta: {rule: "sonar:StringCheckOnLeft"}
        }
    ]
};

module.exports = toolAgents;