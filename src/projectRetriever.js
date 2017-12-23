const cloner = require("./cloner");

const request = {
    repository: {
        type: "git",
        url: "https://github.com/c3pr/sample-project-java-maven.git",
        revision: "83764f5c4a1c5451dcba907009100de5b5d75c7d"
    },
    files: [
        'src/main/java/io/github/c3pr/sample/javamaven/Main.java'
    ],
    rules: [
        "sonar:StringCheckOnLeft"
    ]

};

if (request.repository.type === "git") {
    cloner(request);
}