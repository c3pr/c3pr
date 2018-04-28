module.exports = { 
    toolId: "walkmod-sonar:UseStringEquals",
    extensions: ["java"],
    agentURL: "https://c3pr-tool-walkmod-sonar.now.sh/c3pr",
    command: "walkmod apply sonar:UseStringEquals",
    toolMeta: {rule: "sonar:UseStringEquals"},
    prTitle: "Strings should be compared using equals()",
    prBody: `
Using the equality (\`==\`) and inequality (\`!=\`) operators to compare two objects does not check to see if they have the same values. Rather it checks to see if both object references point to exactly the same object in memory. The vast majority of the time, this is not what you want to do. Use the \`.equals()\` method to compare the values of two objects or to compare a string object to a string literal.

### Noncompliant Code Sample

\`\`\`java
String str1 = "blue";
String str2 = "blue";
String str3 = str1;

if (str1 == str2) {
  System.out.println("they're both 'blue'"); // this doesn't print because the objects are different
}
if (str1 == "blue") {
  System.out.println("they're both 'blue'"); // this doesn't print because the objects are different
}
if (str1 == str3) {
  System.out.println("they're the same object"); // this prints
}
\`\`\`

### Compliant Solution

\`\`\`java
String str1 = "blue";
String str2 = "blue";
String str3 = str1;

if (str1.equals(str2)) {
  System.out.println("they're both 'blue'"); // this prints
}
if (str1.equals("blue")) {
  System.out.println("they're both 'blue'"); // this prints
}
if (str1 == str3) {
  System.out.println("they're the same object"); // this still prints, but it's probably not what you meant to do
}
\`\`\`
`
};