const expect = require('chai').expect;
const cloneRepositoryLocally = require("./cloneRepositoryLocally");
const determineGitDiff = require('./determineGitDiff');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const path = require('path');
const shell = require('./shell').shell;

describe('determineGitDiff', () => {

    it('should have existing folder with specific files', async () => {

        const localUniqueCorrelationId = uuidv4();
        const sha = '30b03c1d8aa6ee670534b80edd0dc39c12644259';

        const cloneFolder = await cloneRepositoryLocally({
            localUniqueCorrelationId: localUniqueCorrelationId,
            cloneBaseDir: '/tmp/c3pr/test/clones',
            url: 'https://github.com/c3pr/sample-project-java-maven.git',
            branch: 'branch-for-clone-tests',
            revision: sha,
            cloneDepth: 5
        });

        await shell(`echo some-change >> pom.xml`, {cwd: cloneFolder});
        fs.unlinkSync(path.join(cloneFolder, 'README.md'));
        await shell(`echo some-new-file > src/main/java/MyNewClass.java`, {cwd: cloneFolder});

        const diff = await determineGitDiff(`${sha}${localUniqueCorrelationId}`, cloneFolder);
        expect(diff).to.be.equal(
`diff --git a/README.md b/README.md
deleted file mode 100644
index 70f85b5..0000000
--- a/README.md
+++ /dev/null
@@ -1,3 +0,0 @@
-# Sample Java + Maven Project
-
-Example Java+Maven project with issues that could be fixed by static analysis tools.
diff --git a/pom.xml b/pom.xml
index ad8bb19..bfe7cd3 100644
--- a/pom.xml
+++ b/pom.xml
@@ -13,3 +13,4 @@
 	</properties>
 
 </project>
+some-change 
diff --git a/src/main/java/MyNewClass.java b/src/main/java/MyNewClass.java
new file mode 100644
index 0000000..e7df300
--- /dev/null
+++ b/src/main/java/MyNewClass.java
@@ -0,0 +1 @@
+some-new-file 
`);

    }).timeout(10 * 1000);

});