module.exports = { 
    toolId: "walkmod-sonar:UseStringEquals",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:UseStringEquals -i #{filename}",
    toolMeta: {rule: "sonar:UseStringEquals"},
    prTitle: "Strings should be compared using equals()",
    prBody: `
Using the equality (\`==\`) and inequality (\`!=\`) operators to compare two strings does not check to see if
 they have the same values. Rather it checks to see if both object references point to exactly the same object
  in memory. The vast majority of the time, this is not what you want to do.
   
Use the \`.equals()\` method to compare a string object to a string literal.

### Noncompliant Code Sample

\`\`\`java
String strOne = "blue";
String strTwo = new String("blue"); // this is the same as if strTwo was read from a file, an HTTP request, console input, etc.

if (strOne == "blue") {
    System.out.println("strOne is \\"blue\\""); // prints
}
if (strTwo == "blue") {
    System.out.println("strTwo is \\"blue\\""); // DOESN'T print
}
if (strOne != "blue") {
    System.out.println("strOne is not \\"blue\\""); // prints
}
if (strTwo != "blue") {
    System.out.println("strTwo is not \\"blue\\""); // DOESN'T print
}
\`\`\`

### Compliant Solution

\`\`\`java
String strOne = "blue";
String strTwo = new String("blue"); // this is the same as if strTwo was read from a file, an HTTP request, console input, etc.

if (strOne.equals("blue")) {
    System.out.println("strOne is \\"blue\\""); // prints
}
if (strTwo.equals("blue")) {
    System.out.println("strTwo is \\"blue\\""); // prints
}
if (!strOne.equals("blue")) {
    System.out.println("strOne is not \\"blue\\""); // DOESN'T print
}
if (!strTwo.equals("blue")) {
    System.out.println("strTwo is not \\"blue\\""); // DOESN'T print
}
\`\`\`
`
};