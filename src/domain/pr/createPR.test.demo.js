const assert = require('assert');
const createPR = require('./createPR');
const config = require('../../config');
const githubClient = require('octonode').client(config.c3pr.gitHubApiToken);
const ghrepo = githubClient.repo('c3pr/sample-project-java-maven');
ghrepo.prs(async (err, prsBefore) => {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // ATTENTION
    // ATTENTION
    // ATTENTION
    // ATTENTION
    // ATTENTION
    // ATTENTION
    //
    // THIS IS AN INTEGRATION TEST. THIS CODE ACTUALLY CREATES A PR in the repo @ github. Just thought you should know.
    //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const newPrTitle = `My Test PR @ ${new Date().toISOString()}`;

    // o fetch e a pull request sao criados em um branch
    // existe a possibilidade de fazerem um push, entre o webhook inicial e a criacao da PR, que apague um arquivo que a PR modifica.
    // Realmente, nao ha muito o que podemos fazer. Se o arquivo foi apagado, entao nao precisava da PR mesmo. Se ele foi
    // movido, talvez uma nova PR venha a ser feita quando do novo webhook
    await createPR({
        mainRepoOrgRepo: 'c3pr/sample-project-java-maven',
        mainRepoBranch: 'prCreationTestBranch',
        mainRepoHash: '1fb4aaf9b45b64ec0778f085349109175c328195',
        gitHubApiToken: config.c3pr.gitHubApiToken,
        gitUserName: config.c3pr.gitUserName,
        gitUserEmail: config.c3pr.gitUserEmail,
        prCommitMessage: 'The commit message, quotes " involved',
        prTitle: newPrTitle,
        prBody: "This is `the body`. It does support **markdown**.",
        patchContent: 'ZGlmZiAtLWdpdCBhL1JFQURNRS5tZCBiL1JFQURNRS5tZAppbmRleCA0MzU3NTc0Li4xZTAzYjQ5IDEwMDY0NAotLS0gYS9SRUFETUUubWQK' +
        'KysrIGIvUkVBRE1FLm1kCkBAIC0xLDMgKzEsMyBAQAogIyBTYW1wbGUgSmF2YStNYXZlbiBQcm9qZWN0CiAKLUV4YW1wbGUgSmF2YStNYXZlbiBwcm9qZWN0IH' +
        'dpdGggaXNzdWVzIHRoYXQgY291bGQgYmUgZml4ZWQgYnkgc3RhdGljIGFuYWx5c2lzIHRvb2xzLgorRXhhbXBsZSBKYXjp7W91K01hdmVuIHByb2plY3Qgd2l0' +
        'aCBpc3N1ZXMgdGhhdCBjb3VsZCBiZSBmaXhlZCBieSBzdGF0aWMgYW5hbHlzaXMgdG9vbHMuCmRpZmYgLS1naXQgYS9zcmMvbWFpbi9qYXZhL2lvL2dpdGh1Yi' +
        '9jM3ByL3NhbXBsZS9qYXZhbWF2ZW4vTWFpbi5qYXZhIGIvc3JjL21haW4vamF2YS9pby9naXRodWIvYzNwci9zYW1wbGUvamF2YW1hdmVuL01haW4uamF2YQpp' +
        'bmRleCAzODg4MzUyLi5kNzhjMmVlIDEwMDY0NAotLS0gYS9zcmMvbWFpbi9qYXZhL2lvL2dpdGh1Yi9jM3ByL3NhbXBsZS9qYXZhbWF2ZW4vTWFpbi5qYXZhCi' +
        'srKyBiL3NyYy9tYWluL2phdmEvaW8vZ2l0aHViL2MzcHIvc2FtcGxlL2phdmFtYXZlbi9NYWluLmphdmEKQEAgLTYsNyArNiw3IEBAIHB1YmxpYyBjbGFzcyBN' +
        'YWluIHsKICAgICAgICAgU3RyaW5nIHNvbWVTdHJpbmcgPSBhcmdzWzBdOwogICAgICAgICBpZiAoc29tZVN0cmluZy5lcXVhbHMoImEgc3RyaW5nIGF0IHRoZS' +
        'ByaWdodC1oYW5kIHNpZGUiKSkgewogICAgICAgICAgICAgU3lzdGVtLm91dC5wcmludGxuKCJFcXVhbHMuLi4iKTsKLSAgICAgICAgfSBlbHNlIFN5c3RlbS5v' +
        'dXQucHJpbnRsbigiRWxzZSB3aXRob3V0IGJyYWNlcyIpOworICAgICAgICB9IGVsc2UgU3lzdGVtLm91dC5wcmludGxuKCJFbHNlIHdpdGhvdXQgYnLDocOpw6' +
        '1hY2VzIik7CiAgICAgfQogCiB9Cg=='
    });

    console.log('Checking if PR was created...');
    ghrepo.prs((err, prsAfter) => {
        assert.equal(prsBefore.length + 1, prsAfter.length);

        assert.equal(prsAfter[0].title, newPrTitle);
        console.log('PR successfully created.');
    });

});


