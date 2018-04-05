const invokeToolAtGitRepo = require('./invokeToolAtGitRepo');
require("node-c3pr-logger").testMode();

const expect = require('chai').expect;

const config = require('../config');

config.c3pr.agent.cloneDir = '/tmp/c3pr/test';
config.c3pr.agent.cloneDepth = 5;

describe('invokeToolAtGitRepo', () => {

    it('invokeToolAtGitRepo', async () => {

        const diff = await invokeToolAtGitRepo({
            "meta": {
                "correlationId": "30b03c1d8aa6ee670534b80edd0dc39c12644259",
                "compatibleSchemas": ["c3pr/c3pr-agent::toolInvocation"]
            },
            "c3pr": {
                "prsUrl": "http://c3pr-github.herokuapp.com/prs",
                "patchesUrl": "http://c3pr.herokuapp.com/patches"
            },
            "repository": {
                "type": "git",
                "url": "https://github.com/c3pr/sample-project-java-maven.git",
                "branch": "branch-for-clone-tests",
                "revision": "30b03c1d8aa6ee670534b80edd0dc39c12644259"
            },
            "files": [
                "pom.xml"
            ],
            "tool": {
                "command": "echo this-would-be-a-change-executed-via-tool>> pom.xml",
                "meta": {
                    "rule": "sonar:StringCheckOnLeft"
                }
            }
        });

        expect(diff).to.be.equal(
// this convertion to base64 only works here because there are no accents (so no ISOvsUTF encoding trouble)
Buffer.from(
`diff --git a/pom.xml b/pom.xml
index ad8bb19..7db8f5e 100644
--- a/pom.xml
+++ b/pom.xml
@@ -13,3 +13,4 @@
 	</properties>
 
 </project>
+this-would-be-a-change-executed-via-tool
`,).toString('base64'));

    }).timeout(10 * 1000);

});