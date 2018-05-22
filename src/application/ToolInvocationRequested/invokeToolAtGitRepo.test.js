require("node-c3pr-logger").testMode();
const invokeToolAtGitRepo = require('./invokeToolAtGitRepo');

const expect = require('chai').expect;

const config = require('../../config');

config.c3pr.agent.cloneDir = '/tmp/c3pr/test';
config.c3pr.agent.cloneDepth = 5;

const loadTools = {
    toolsHash: {}
};

describe('invokeToolAtGitRepo', () => {

    it('invokeToolAtGitRepo', async () => {

        const toolInvocationResult = await invokeToolAtGitRepo({
            "meta": {
                "correlationId": "30b03c1d8aa6ee670534b80edd0dc39c12644259",
                "compatibleSchemas": ["c3pr/c3pr-agent::toolInvocation"]
            },
            "c3pr": {
                "prsUrl": "http://c3pr-github.herokuapp.com/prs",
                "patchesUrl": "http://c3pr-brain.herokuapp.com/patches"
            },
            "repository": {
                "full_path": "c3pr/sample-project-java-maven",
                "clone_url_http": "https://github.com/c3pr/sample-project-java-maven.git",
                "branch": "branch-for-clone-tests",
                "revision": "30b03c1d8aa6ee670534b80edd0dc39c12644259"
            },
            "files": [
                "pom.xml",
                "README.md"
            ],
            "tool": {
                "command": "echo this-would-be-a-change-executed-via-tool in the !#{filename}! file>> #{filename}",
                "meta": {
                    "rule": "sonar:StringCheckOnLeft"
                }
            }
        }, loadTools);

        expect(toolInvocationResult.files).to.deep.equal(["README.md", "pom.xml"]);

const diff =
`diff --git a/README.md b/README.md
index 70f85b5..c202dcd 100644
--- a/README.md
+++ b/README.md
@@ -1,3 +1,4 @@
 # Sample Java + Maven Project
 
 Example Java+Maven project with issues that could be fixed by static analysis tools.
+this-would-be-a-change-executed-via-tool in the !README.md! file
diff --git a/pom.xml b/pom.xml
index ad8bb19..78c4a56 100644
--- a/pom.xml
+++ b/pom.xml
@@ -13,3 +13,4 @@
 	</properties>
 
 </project>
+this-would-be-a-change-executed-via-tool in the !pom.xml! file
`;
        expect(Buffer.from(toolInvocationResult.diff, 'base64').toString()).to.be.equal(diff);

        // this convertion to base64 only works here because there are no accents (so no ISOvsUTF encoding trouble)
        expect(toolInvocationResult.diff).to.be.equal(Buffer.from(diff).toString('base64'));

    }).timeout(10 * 1000);

    it('invokeToolAtGitRepo NO DIFF', async () => {

        const toolInvocationResult = await invokeToolAtGitRepo({
            "meta": {
                "correlationId": "30b03c1d8aa6ee670534b80edd0dc39c12644259",
                "compatibleSchemas": ["c3pr/c3pr-agent::toolInvocation"]
            },
            "c3pr": {
                "prsUrl": "http://c3pr-github.herokuapp.com/prs",
                "patchesUrl": "http://c3pr-brain.herokuapp.com/patches"
            },
            "repository": {
                "full_path": "c3pr/sample-project-java-maven",
                "url": "https://github.com/c3pr/sample-project-java-maven.git",
                "branch": "branch-for-clone-tests",
                "revision": "30b03c1d8aa6ee670534b80edd0dc39c12644259"
            },
            "files": [
                "pom.xml"
            ],
            "tool": {
                "command": "echo nothing",
                "meta": {
                    "rule": "sonar:StringCheckOnLeft"
                }
            }
        }, loadTools);

        expect(toolInvocationResult.files).to.deep.equal([]);
        expect(toolInvocationResult.diff).to.be.equal('');

    }).timeout(10 * 1000);

});