const toolAgents = {
    agents: [
        {
            name: "walkmod-sonar:StringCheckOnLeft",
            extensions: ["java"],
            // agentURL: "http://some-server-running-walkmod-docker.com:5000/c3pr",
            agentURL: "http://localhost:5002/c3pr",
            // this 'arguments' field is optional and has meaning only to the agent. it will be included in the POST to the tool
            arguments: {rule: "sonar:StringCheckOnLeft"}
        }
    ]
};

module.exports = toolAgents;