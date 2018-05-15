const expect = require('chai').expect;
const filterFilesWithExtensions = require('./filterFilesWithExtensions');

describe('filterFilesWithExtensions', function () {
    it('filterFilesWithExtensions', function () {
        const changeset = ['src/main/a/b/c/Main.java', 'src/main/a/b/c/Dockerfile', 'src/main/a/b/c/Main.js', 'src/abc.java'];
        const extensions = ['java', 'js'];

        expect(filterFilesWithExtensions(changeset, extensions)).to.deep.equal([
            'src/main/a/b/c/Main.java', 'src/main/a/b/c/Main.js', 'src/abc.java'
        ]);
    });
});