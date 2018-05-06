var github = require('octonode');

const config = require('../../config');
var client = github.client(config.c3pr.gitHubApiToken);

// client.get('/user', {}, function (err, status, body, headers) {
//     console.log(body); //json object
// });

const ghme = client.me();

ghme.fork('c3pr/sample-project-java-maven', (a, b, c) => {
    console.log('Done forking');

    const ghrepo = client.repo('acdcjunior/sample-project-java-maven');
    // ghrepo.createContents('lib/index.js', 'commit message', 'content', () => {
    //     console.log('done creating');

        ghrepo.updateContents('lib/index.js', 'commit message2', Buffer.from("Hello World").toString('base64'), '<<must get this using an API request to the current content>>', 'master', (a,b,c) => {
            console.log('done updating');
            console.log('\n'.repeat(30));
            console.log(a);
            console.log('\n'.repeat(2));
            console.log(b);
            console.log('\n'.repeat(2));
            console.log(c);
        });
    // });


});

