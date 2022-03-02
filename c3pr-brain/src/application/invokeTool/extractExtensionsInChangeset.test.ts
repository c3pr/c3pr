import { expect } from 'chai';

const extractExtensionsInChangeset = require("./extractExtensionsInChangeset").extractExtensionsInChangeset;
const extractExtension = require("./extractExtensionsInChangeset").extractExtension;

describe('extractExtension', function () {
    it('should extract extension', function () {

        expect(extractExtension('src/main/Main.java')).to.equal('java');
        expect(extractExtension('src/main/Main.jAVa')).to.equal('java');
        expect(extractExtension('src/main/jah.js')).to.equal('js');
        expect(extractExtension('src/main/abc.test.js')).to.equal('js');
        expect(extractExtension('jah.ZYZ')).to.equal('zyz');
        expect(extractExtension('a/b/c/Dockerfile')).to.equal('dockerfile');
        expect(extractExtension('a/b/c/.gah')).to.equal('gah');
        expect(extractExtension('a/b/c/.ga/h')).to.equal('h');
        expect(extractExtension('a/b/zz/')).to.equal('zz');
        expect(extractExtension('')).to.equal('');
    });
});
describe('extractExtensionsInChangeset', function () {
    it('should extract extension', function () {

        const changeset = ['src/main/a/b/c/Main.java', 'src/main/a/b/c/Main.js', 'src/main/a/b/c/Dockerfile'];

        expect(extractExtensionsInChangeset(changeset)).to.deep.equal(['java', 'js', 'dockerfile']);
        expect(extractExtensionsInChangeset([])).to.deep.equal([]);
    });
});