const generateGitPatchBase64  = require('./generateGitPatchBase64').default;

const expect = require('chai').expect;
const cloneRepositoryLocally = require("../src/cloneRepositoryLocally");

const uuidv4 = require('uuid/v4');
const fs = require('fs');
const path = require('path');

// noinspection JSUnresolvedFunction
require("node-c3pr-logger/c3prLOG4").default.testMode();


const expectedPatchBody = `
 file-to-append-spaces-only.txt                               | 5 +++++
 file-to-append.txt                                           | 1 +
 file-to-remove.txt                                           | 1 -
 ...e-and-append.txt => file-to-rename-and-append-renamed.txt | 1 +
 file-to-rename-only.txt => file-to-rename-only-renamed.txt   | 0
 iso-8859-1_file.txt                                          | 2 +-
 new-file.txt                                                 | 1 +
 utf-8_file.txt                                               | 2 +-
 utf8-file-will-add-spaces.txt                                | 5 +++--
 9 files changed, 13 insertions(+), 5 deletions(-)
 delete mode 100644 file-to-remove.txt
 rename file-to-rename-and-append.txt => file-to-rename-and-append-renamed.txt (63%)
 rename file-to-rename-only.txt => file-to-rename-only-renamed.txt (100%)
 create mode 100644 new-file.txt

diff --git a/file-to-append-spaces-only.txt b/file-to-append-spaces-only.txt
index bb6da1f..1eba3d3 100644
--- a/file-to-append-spaces-only.txt
+++ b/file-to-append-spaces-only.txt
@@ -1 +1,6 @@
 Spaces will be appended to this file.
+
+ 
+
+ 	CARRIAGE-HERE
+  
\\ No newline at end of file
diff --git a/file-to-append.txt b/file-to-append.txt
index d22da3a..ff77f3e 100644
--- a/file-to-append.txt
+++ b/file-to-append.txt
@@ -1 +1,2 @@
 Will append some content to this file.
+some change
\\ No newline at end of file
diff --git a/file-to-remove.txt b/file-to-remove.txt
deleted file mode 100644
index 2ec2ef1..0000000
--- a/file-to-remove.txt
+++ /dev/null
@@ -1 +0,0 @@
-Will remove this file.
diff --git a/file-to-rename-and-append.txt b/file-to-rename-and-append-renamed.txt
similarity index 63%
rename from file-to-rename-and-append.txt
rename to file-to-rename-and-append-renamed.txt
index 8297352..52d0a09 100644
--- a/file-to-rename-and-append.txt
+++ b/file-to-rename-and-append-renamed.txt
@@ -1 +1,2 @@
 We will rename this file and append text to it.
+add some text after renaming
\\ No newline at end of file
diff --git a/file-to-rename-only.txt b/file-to-rename-only-renamed.txt
similarity index 100%
rename from file-to-rename-only.txt
rename to file-to-rename-only-renamed.txt
diff --git a/iso-8859-1_file.txt b/iso-8859-1_file.txt
index 6120dbd..57d9804 100644
--- a/iso-8859-1_file.txt
+++ b/iso-8859-1_file.txt
@@ -1,3 +1,3 @@
 I am UTF-8.
 X�����Y.�!
-I'm test file.�!
\\ No newline at end of file
+I'm test file.�!aaa
\\ No newline at end of file
diff --git a/new-file.txt b/new-file.txt
new file mode 100644
index 0000000..d43816e
--- /dev/null
+++ b/new-file.txt
@@ -0,0 +1 @@
+new file created
\\ No newline at end of file
diff --git a/utf-8_file.txt b/utf-8_file.txt
index 7a6603f..434bb32 100644
--- a/utf-8_file.txt
+++ b/utf-8_file.txt
@@ -1,3 +1,3 @@
 I am UTF-8.
 XãéìöûZ.á!
-I'm test file.é!
\\ No newline at end of file
+I'm test file.é!bbb
\\ No newline at end of file
diff --git a/utf8-file-will-add-spaces.txt b/utf8-file-will-add-spaces.txt
index 765777f..63c887f 100644
--- a/utf8-file-will-add-spaces.txt
+++ b/utf8-file-will-add-spaces.txt
@@ -1,5 +1,6 @@
 line1	
 	
 line3
-áé óú.
-xyz.
+áé          óú.		
+xyz!
+!!
\\ No newline at end of file`.replace(/\r\n/g, '\n').replace('CARRIAGE-HERE', '\r');


describe('generateGitPatchBase64', () => {

    let cloneOptions, localUniqueCorrelationId, sha, ids, logMeta;
    const gitUserName = 'c3pr', gitUserEmail = 'c3pr@example.com', commitMessage = 'commit-msg';

    beforeEach(() => {
        localUniqueCorrelationId = uuidv4();
        sha = '025db277fed8c87c46878d6af67dd2ce487afe28';
        cloneOptions = {
            localUniqueCorrelationId: localUniqueCorrelationId,
            cloneBaseDir: '/tmp/c3pr/test/clones',
            url: 'https://github.com/c3pr/node-git-client.git',
            branch: 'diff-base64-test-branch',
            revision: sha,
            cloneDepth: 2
        };
        ids = [sha, localUniqueCorrelationId];
        logMeta = {nodeName: 'DGDB-test', correlationId: ids, moduleName: 'generateGitPatchBase64.test.js'};
    });

    it('generateGitPatchBase64 no changes', async () => {

        /// setup:

        const cloneFolder = await cloneRepositoryLocally(cloneOptions, logMeta);

        /// execute:

        const filesAndDiff = await generateGitPatchBase64({cloneFolder, gitUserName, gitUserEmail, commitMessage}, {ids});

        /// verify:

        expect(filesAndDiff).to.deep.equal({
            files: {added: [], modified: [], renamed: [], deleted: []},
            patch: {
                hexBase64: '',
                header: '',
                footer: '',
                plain: ''
            }
        });

    }).timeout(10 * 1000);

    it('generateGitPatchBase64 file changes', async () => {
        /// setup:

        const cloneFolder = await cloneRepositoryLocally(cloneOptions, logMeta);

        // BEGIN: changes
        // DELETED
        fs.unlinkSync(path.join(cloneFolder, 'file-to-remove.txt'));
        // ADDED
        fs.appendFileSync(path.join(cloneFolder, 'new-file.txt'), 'new file created');
        // RENAMED
        fs.renameSync(path.join(cloneFolder, 'file-to-rename-only.txt'), path.join(cloneFolder, 'file-to-rename-only-renamed.txt'));
        fs.renameSync(path.join(cloneFolder, 'file-to-rename-and-append.txt'), path.join(cloneFolder, 'file-to-rename-and-append-renamed.txt'));
        fs.appendFileSync(path.join(cloneFolder, 'file-to-rename-and-append-renamed.txt'), 'add some text after renaming');
        // MODIFIED
        fs.appendFileSync(path.join(cloneFolder, 'file-to-append.txt'), 'some change');
        fs.writeFileSync(path.join(cloneFolder, 'utf8-file-will-add-spaces.txt'), 'line1\t\n\t\nline3\náé          óú.\t\t\nxyz!\n!!');

        fs.appendFileSync(path.join(cloneFolder, 'iso-8859-1_file.txt'), 'aaa');
        fs.appendFileSync(path.join(cloneFolder, 'utf-8_file.txt'), 'bbb');

        fs.appendFileSync(path.join(cloneFolder, 'file-to-append-spaces-only.txt'), '\n \n\n \t\r\n  ');
        // END: changes


        /// execute:

        const gitPatchBase64 = await generateGitPatchBase64({cloneFolder, gitUserName, gitUserEmail, commitMessage}, {ids});

        /// verify:

        const expectedPatch = `${gitPatchBase64.patch.header}${expectedPatchBody}\n${gitPatchBase64.patch.footer}`;

        expect(gitPatchBase64.patch.plain).to.be.equal(expectedPatch);

        expect(gitPatchBase64.files).to.deep.equal({
            deleted: ['file-to-remove.txt'],
            added: ['new-file.txt'],
            renamed: [{from: 'file-to-rename-and-append.txt', to: 'file-to-rename-and-append-renamed.txt'}, {from: 'file-to-rename-only.txt', to: 'file-to-rename-only-renamed.txt'}],
            modified: [
                'file-to-append-spaces-only.txt',
                'file-to-append.txt',
                'iso-8859-1_file.txt',
                'utf-8_file.txt',
                'utf8-file-will-add-spaces.txt',
            ],
        });

        const dynamic = Buffer.from(expectedPatch).toString('base64');

        // The testPatchFile string differs from the actual PATCH in the beginning (the git SHA generated)
        const testPatchFile = Buffer.from(fs.readFileSync(path.resolve(__dirname, 'generateGitPatchBase64.test.patch'), 'hex'), 'hex').toString('base64');

        const numberOfCharsWhichPatchDiffers = 1162;
        const cutPoint = dynamic.length - numberOfCharsWhichPatchDiffers;

        expect(gitPatchBase64.patch.hexBase64).to.be.equal(dynamic.substring(0, cutPoint) + testPatchFile.substring(cutPoint, testPatchFile.length));

        console.log('\n');
        console.log('\n');
        console.log(gitPatchBase64.patch.hexBase64);
        console.log('\n');
        console.log('\n');

        fs.writeFileSync(path.resolve(cloneFolder, 'patch-from-base64'), Buffer.from(gitPatchBase64.patch.hexBase64, 'base64').toString('hex'), 'hex');
        expect(await fileHash(path.resolve(cloneFolder, '1'))).to.be.equal(await fileHash(path.resolve(cloneFolder, 'patch-from-base64')));

    }).timeout(10 * 1000);

});

function fileHash(filename) {
    return new Promise((resolve) => {
        const shasum = require('crypto').createHash('sha256');
        // noinspection JSValidateTypes
        const stream = fs.ReadStream(filename);
        stream.on('data', data => shasum.update(data));
        stream.on('end', () => resolve(shasum.digest('hex')))
    });
}