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
            agentURL: "https://c3pr-tool-walkmod-sonar-now-hjmsouxims.now.sh/c3pr",
            command: "walkmod apply sonar:StringCheckOnLeft",
            toolMeta: {rule: "sonar:StringCheckOnLeft"},
            prTitle: "Strings literals should be placed on the left side when checking for equality",
            prBody: `
It is preferable to place string literals on the left-hand side of an \`equals()\` or \`equalsIgnoreCase()\` method call. This prevents null pointer exceptions from being raised, as a string literal can never be \`null\` by definition.

The following code:

\`\`\`java
String myString = null;

System.out.println("Equal? " + myString.equals("foo"));                        // Non-Compliant - will raise a NPE
System.out.println("Equal? " + (myString != null && myString.equals("foo")));  // Non-Compliant - null check could be removed
\`\`\`

should be refactored into:

\`\`\`java
System.out.println("Equal?" + "foo".equals(myString));                         // Compliant - properly deals with the null case
\`\`\`
`
        },
        {
            toolId: "walkmod-sonar:RemoveUselessImports",
            extensions: ["java"],
            agentURL: "https://c3pr-tool-walkmod-sonar-now-hjmsouxims.now.sh/c3pr",
            command: "walkmod apply sonar:RemoveUselessImports",
            toolMeta: {rule: "sonar:RemoveUselessImports"},
            prTitle: "Useless imports",
            prBody: `Useless imports are bad!`
        }
    ]
};

module.exports = toolAgents;