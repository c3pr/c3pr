const expect = require('chai').expect;
const cloneRepositoryLocally = require("./cloneRepositoryLocally");
const determineGitDiffBase64 = require('./determineGitDiffBase64');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const path = require('path');
const shell = require('./shell');


describe('determineGitDiffBase64', () => {

    it('determineGitDiffBase64', async () => {

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

        await shell(`echo some-change>> pom.xml`, {cwd: cloneFolder});
        fs.unlinkSync(path.join(cloneFolder, 'README.md'));
        await shell(`echo some-new-file> src/main/java/MyNewClass.java`, {cwd: cloneFolder});

        const diff = await determineGitDiffBase64(sha, localUniqueCorrelationId, cloneFolder);
        expect(diff).to.be.equal(

// this convertion to base64 only works here because there are no accents (so no ISOvsUTF encoding trouble)
Buffer.from(
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
index ad8bb19..b6705f2 100644
--- a/pom.xml
+++ b/pom.xml
@@ -13,3 +13,4 @@
 	</properties>
 
 </project>
+some-change
diff --git a/src/main/java/MyNewClass.java b/src/main/java/MyNewClass.java
new file mode 100644
index 0000000..80772dc
--- /dev/null
+++ b/src/main/java/MyNewClass.java
@@ -0,0 +1 @@
+some-new-file
`,).toString('base64'));

    }).timeout(10 * 1000);

    it('determineGitDiffBase64', async () => {

        const patchContent = 'ZGlmZiAtLWdpdCBhL1JFQURNRS5tZCBiL1JFQURNRS5tZAppbmRleCA0MzU3NTc0Li4xZTAzYjQ5IDEwMDY0NAotLS0gYS9SRUFETUUubWQK' +
            'KysrIGIvUkVBRE1FLm1kCkBAIC0xLDMgKzEsMyBAQAogIyBTYW1wbGUgSmF2YStNYXZlbiBQcm9qZWN0CiAKLUV4YW1wbGUgSmF2YStNYXZlbiBwcm9qZWN0IH' +
            'dpdGggaXNzdWVzIHRoYXQgY291bGQgYmUgZml4ZWQgYnkgc3RhdGljIGFuYWx5c2lzIHRvb2xzLgorRXhhbXBsZSBKYXjp7W91K01hdmVuIHByb2plY3Qgd2l0' +
            'aCBpc3N1ZXMgdGhhdCBjb3VsZCBiZSBmaXhlZCBieSBzdGF0aWMgYW5hbHlzaXMgdG9vbHMuCmRpZmYgLS1naXQgYS9zcmMvbWFpbi9qYXZhL2lvL2dpdGh1Yi' +
            '9jM3ByL3NhbXBsZS9qYXZhbWF2ZW4vTWFpbi5qYXZhIGIvc3JjL21haW4vamF2YS9pby9naXRodWIvYzNwci9zYW1wbGUvamF2YW1hdmVuL01haW4uamF2YQpp' +
            'bmRleCAzODg4MzUyLi5kNzhjMmVlIDEwMDY0NAotLS0gYS9zcmMvbWFpbi9qYXZhL2lvL2dpdGh1Yi9jM3ByL3NhbXBsZS9qYXZhbWF2ZW4vTWFpbi5qYXZhCi' +
            'srKyBiL3NyYy9tYWluL2phdmEvaW8vZ2l0aHViL2MzcHIvc2FtcGxlL2phdmFtYXZlbi9NYWluLmphdmEKQEAgLTYsNyArNiw3IEBAIHB1YmxpYyBjbGFzcyBN' +
            'YWluIHsKICAgICAgICAgU3RyaW5nIHNvbWVTdHJpbmcgPSBhcmdzWzBdOwogICAgICAgICBpZiAoc29tZVN0cmluZy5lcXVhbHMoImEgc3RyaW5nIGF0IHRoZS' +
            'ByaWdodC1oYW5kIHNpZGUiKSkgewogICAgICAgICAgICAgU3lzdGVtLm91dC5wcmludGxuKCJFcXVhbHMuLi4iKTsKLSAgICAgICAgfSBlbHNlIFN5c3RlbS5v' +
            'dXQucHJpbnRsbigiRWxzZSB3aXRob3V0IGJyYWNlcyIpOworICAgICAgICB9IGVsc2UgU3lzdGVtLm91dC5wcmludGxuKCJFbHNlIHdpdGhvdXQgYnLDocOpw6' +
            '1hY2VzIik7CiAgICAgfQogCiB9Cg==';

        const localUniqueCorrelationId = uuidv4();

        const cloneFolder = await cloneRepositoryLocally({
            localUniqueCorrelationId: localUniqueCorrelationId,
            cloneBaseDir: '/tmp/c3pr/test',
            url: "https://github.com/c3pr/sample-project-java-maven.git",
            branch: 'prCreationTestBranch',
            revision: '1fb4aaf9b45b64ec0778f085349109175c328195',
            cloneDepth: 50
        });

        const patchFileName = `c3pr-${localUniqueCorrelationId}.patch`;
        const patchFilePath = `${cloneFolder}/${patchFileName}`;
        fs.writeFileSync(patchFilePath, Buffer.from(patchContent, 'base64').toString('hex'), 'hex');
        await shell(`git apply ${patchFileName}`, {cwd: cloneFolder});
        fs.unlinkSync(patchFilePath);

        const gitDiff = await determineGitDiffBase64('1fb4aaf9b45b64ec0778f085349109175c328195', localUniqueCorrelationId, cloneFolder);

        expect(patchContent).to.be.equal(gitDiff);

    }).timeout(10 * 1000);

});