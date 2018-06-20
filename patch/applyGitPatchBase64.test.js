const c3prSH3 = require("../src/c3prSH3").default;

const applyGitPatchBase64  = require('./applyGitPatchBase64').default;

const expect = require('chai').expect;
const cloneRepositoryLocally = require("../src/cloneRepositoryLocally");

const uuidv4 = require('uuid/v4');

// noinspection JSUnresolvedFunction
require("node-c3pr-logger").testMode();

const hexBase64 = 'RnJvbSBkYzEyODkwNWJjYjNiMDZhZDFkZjI2NmEwYWE5OWVlODJlNzJmZTRkIE1vbiBTZXAgMTcgMDA6MDA6MDAgMjAwMQpGcm9tOiBjM3ByIDxjM3ByQGV4YW1wbGUuY29tPgpEYXRlOiBXZWQsIDIwIEp1bi' +
    'AyMDE4IDEyOjM2OjU4IC0wMzAwClN1YmplY3Q6IFtQQVRDSCAxLzFdIGNvbW1pdC1tc2cKCi0tLQogZmlsZS10by1hcHBlbmQtc3BhY2VzLW9ubHkudHh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgNSArKysrKw' +
    'ogZmlsZS10by1hcHBlbmQudHh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgMSArCiBmaWxlLXRvLXJlbW92ZS50eHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC' +
    'AgfCAxIC0KIC4uLmUtYW5kLWFwcGVuZC50eHQgPT4gZmlsZS10by1yZW5hbWUtYW5kLWFwcGVuZC1yZW5hbWVkLnR4dCB8IDEgKwogZmlsZS10by1yZW5hbWUtb25seS50eHQgPT4gZmlsZS10by1yZW5hbWUtb25seS1yZW5hbW' +
    'VkLnR4dCAgIHwgMAogaXNvLTg4NTktMV9maWxlLnR4dCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgMiArLQogbmV3LWZpbGUudHh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC' +
    'AgICAgICAgICAgICAgIHwgMSArCiB1dGYtOF9maWxlLnR4dCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAyICstCiB1dGY4LWZpbGUtd2lsbC1hZGQtc3BhY2VzLnR4dCAgICAgICAgIC' +
    'AgICAgICAgICAgICAgICAgICAgICAgfCA1ICsrKy0tCiA5IGZpbGVzIGNoYW5nZWQsIDEzIGluc2VydGlvbnMoKyksIDUgZGVsZXRpb25zKC0pCiBkZWxldGUgbW9kZSAxMDA2NDQgZmlsZS10by1yZW1vdmUudHh0CiByZW5hbW' +
    'UgZmlsZS10by1yZW5hbWUtYW5kLWFwcGVuZC50eHQgPT4gZmlsZS10by1yZW5hbWUtYW5kLWFwcGVuZC1yZW5hbWVkLnR4dCAoNjMlKQogcmVuYW1lIGZpbGUtdG8tcmVuYW1lLW9ubHkudHh0ID0+IGZpbGUtdG8tcmVuYW1lLW' +
    '9ubHktcmVuYW1lZC50eHQgKDEwMCUpCiBjcmVhdGUgbW9kZSAxMDA2NDQgbmV3LWZpbGUudHh0CgpkaWZmIC0tZ2l0IGEvZmlsZS10by1hcHBlbmQtc3BhY2VzLW9ubHkudHh0IGIvZmlsZS10by1hcHBlbmQtc3BhY2VzLW9ubH' +
    'kudHh0CmluZGV4IGJiNmRhMWYuLjFlYmEzZDMgMTAwNjQ0Ci0tLSBhL2ZpbGUtdG8tYXBwZW5kLXNwYWNlcy1vbmx5LnR4dAorKysgYi9maWxlLXRvLWFwcGVuZC1zcGFjZXMtb25seS50eHQKQEAgLTEgKzEsNiBAQAogU3BhY2' +
    'VzIHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhpcyBmaWxlLgorCisgCisKKyAJDQorICAKXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlCmRpZmYgLS1naXQgYS9maWxlLXRvLWFwcGVuZC50eHQgYi9maWxlLXRvLWFwcGVuZC50eH' +
    'QKaW5kZXggZDIyZGEzYS4uZmY3N2YzZSAxMDA2NDQKLS0tIGEvZmlsZS10by1hcHBlbmQudHh0CisrKyBiL2ZpbGUtdG8tYXBwZW5kLnR4dApAQCAtMSArMSwyIEBACiBXaWxsIGFwcGVuZCBzb21lIGNvbnRlbnQgdG8gdGhpcy' +
    'BmaWxlLgorc29tZSBjaGFuZ2UKXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlCmRpZmYgLS1naXQgYS9maWxlLXRvLXJlbW92ZS50eHQgYi9maWxlLXRvLXJlbW92ZS50eHQKZGVsZXRlZCBmaWxlIG1vZGUgMTAwNjQ0CmluZG' +
    'V4IDJlYzJlZjEuLjAwMDAwMDAKLS0tIGEvZmlsZS10by1yZW1vdmUudHh0CisrKyAvZGV2L251bGwKQEAgLTEgKzAsMCBAQAotV2lsbCByZW1vdmUgdGhpcyBmaWxlLgpkaWZmIC0tZ2l0IGEvZmlsZS10by1yZW5hbWUtYW5kLW' +
    'FwcGVuZC50eHQgYi9maWxlLXRvLXJlbmFtZS1hbmQtYXBwZW5kLXJlbmFtZWQudHh0CnNpbWlsYXJpdHkgaW5kZXggNjMlCnJlbmFtZSBmcm9tIGZpbGUtdG8tcmVuYW1lLWFuZC1hcHBlbmQudHh0CnJlbmFtZSB0byBmaWxlLX' +
    'RvLXJlbmFtZS1hbmQtYXBwZW5kLXJlbmFtZWQudHh0CmluZGV4IDgyOTczNTIuLjUyZDBhMDkgMTAwNjQ0Ci0tLSBhL2ZpbGUtdG8tcmVuYW1lLWFuZC1hcHBlbmQudHh0CisrKyBiL2ZpbGUtdG8tcmVuYW1lLWFuZC1hcHBlbm' +
    'QtcmVuYW1lZC50eHQKQEAgLTEgKzEsMiBAQAogV2Ugd2lsbCByZW5hbWUgdGhpcyBmaWxlIGFuZCBhcHBlbmQgdGV4dCB0byBpdC4KK2FkZCBzb21lIHRleHQgYWZ0ZXIgcmVuYW1pbmcKXCBObyBuZXdsaW5lIGF0IGVuZCBvZi' +
    'BmaWxlCmRpZmYgLS1naXQgYS9maWxlLXRvLXJlbmFtZS1vbmx5LnR4dCBiL2ZpbGUtdG8tcmVuYW1lLW9ubHktcmVuYW1lZC50eHQKc2ltaWxhcml0eSBpbmRleCAxMDAlCnJlbmFtZSBmcm9tIGZpbGUtdG8tcmVuYW1lLW9ubH' +
    'kudHh0CnJlbmFtZSB0byBmaWxlLXRvLXJlbmFtZS1vbmx5LXJlbmFtZWQudHh0CmRpZmYgLS1naXQgYS9pc28tODg1OS0xX2ZpbGUudHh0IGIvaXNvLTg4NTktMV9maWxlLnR4dAppbmRleCA2MTIwZGJkLi41N2Q5ODA0IDEwMD' +
    'Y0NAotLS0gYS9pc28tODg1OS0xX2ZpbGUudHh0CisrKyBiL2lzby04ODU5LTFfZmlsZS50eHQKQEAgLTEsMyArMSwzIEBACiBJIGFtIFVURi04LgogWOPp7fb7WS7hIQotSSdtIHRlc3QgZmlsZS7pIQpcIE5vIG5ld2xpbmUgYX' +
    'QgZW5kIG9mIGZpbGUKK0knbSB0ZXN0IGZpbGUu6SFhYWEKXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlCmRpZmYgLS1naXQgYS9uZXctZmlsZS50eHQgYi9uZXctZmlsZS50eHQKbmV3IGZpbGUgbW9kZSAxMDA2NDQKaW5kZX' +
    'ggMDAwMDAwMC4uZDQzODE2ZQotLS0gL2Rldi9udWxsCisrKyBiL25ldy1maWxlLnR4dApAQCAtMCwwICsxIEBACituZXcgZmlsZSBjcmVhdGVkClwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZQpkaWZmIC0tZ2l0IGEvdXRmLT' +
    'hfZmlsZS50eHQgYi91dGYtOF9maWxlLnR4dAppbmRleCA3YTY2MDNmLi40MzRiYjMyIDEwMDY0NAotLS0gYS91dGYtOF9maWxlLnR4dAorKysgYi91dGYtOF9maWxlLnR4dApAQCAtMSwzICsxLDMgQEAKIEkgYW0gVVRGLTguCi' +
    'BYw6PDqcOsw7bDu1ouw6EhCi1JJ20gdGVzdCBmaWxlLsOpIQpcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUKK0knbSB0ZXN0IGZpbGUuw6khYmJiClwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZQpkaWZmIC0tZ2l0IGEvdX' +
    'RmOC1maWxlLXdpbGwtYWRkLXNwYWNlcy50eHQgYi91dGY4LWZpbGUtd2lsbC1hZGQtc3BhY2VzLnR4dAppbmRleCA3NjU3NzdmLi42M2M4ODdmIDEwMDY0NAotLS0gYS91dGY4LWZpbGUtd2lsbC1hZGQtc3BhY2VzLnR4dAorKy' +
    'sgYi91dGY4LWZpbGUtd2lsbC1hZGQtc3BhY2VzLnR4dApAQCAtMSw1ICsxLDYgQEAKIGxpbmUxCQogCQogbGluZTMKLcOhw6kgw7PDui4KLXh5ei4KK8Ohw6kgICAgICAgICAgw7PDui4JCQoreHl6IQorISEKXCBObyBuZXdsaW' +
    '5lIGF0IGVuZCBvZiBmaWxlCi0tIAoyLjE3LjEud2luZG93cy4yCgo=';

describe('applyGitPatchBase64', () => {

    let cloneOptions, localUniqueCorrelationId, sha, ids, logMeta;

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
        logMeta = {nodeName: 'AGPB-test', correlationId: ids, moduleName: 'applyGitPatchBase64.test.js'};
    });

    it('applyGitPatchBase64', async () => {

        /// setup:

        const cloneFolder = await cloneRepositoryLocally(cloneOptions, logMeta);

        /// execute:

        const patch = {hexBase64, plain: 'unused', header: 'unused', footer: 'unused'};
        await applyGitPatchBase64(cloneFolder, patch, {ids});

        /// verify:

        let headSha = await c3prSH3(`git rev-parse HEAD`, {cwd: cloneFolder}, {ids});
        let gitLogOutput = await c3prSH3(`git log`, {cwd: cloneFolder}, {ids});

        expect(gitLogOutput).to.deep.equal(`commit ${headSha}
Author: c3pr <c3pr@example.com>
Date:   Wed Jun 20 12:36:58 2018 -0300

    commit-msg

commit 025db277fed8c87c46878d6af67dd2ce487afe28
Author: Antônio "acdc" Jr <acdcjunior@gmail.com>
Date:   Sun Jun 10 21:29:04 2018 -0300

    Create file-to-rename-only.txt

commit 51d86e5162517dea36e48165ef54973ce854cc53
Author: Antônio "acdc" Jr <acdcjunior@gmail.com>
Date:   Sun Jun 10 21:28:42 2018 -0300

    Update and rename file-to-rename.txt to file-to-rename-and-append.txt`);

        let gitShowOutput = await c3prSH3(`git show ${headSha}`, {cwd: cloneFolder}, {ids});

        expect(gitShowOutput).to.deep.equal(`commit ${headSha}
Author: c3pr <c3pr@example.com>
Date:   Wed Jun 20 12:36:58 2018 -0300

    commit-msg

diff --git a/file-to-append-spaces-only.txt b/file-to-append-spaces-only.txt
index bb6da1f..fbf5703 100644
--- a/file-to-append-spaces-only.txt
+++ b/file-to-append-spaces-only.txt
@@ -1 +1,5 @@
 Spaces will be appended to this file.
+
+
+
+
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
index 765777f..a5d2cbe 100644
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
\\ No newline at end of file`);

    }).timeout(10 * 1000);

});
