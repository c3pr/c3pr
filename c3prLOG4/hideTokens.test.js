const expect = require('chai').expect;

const hideTokens = require('./hideTokens').default;

describe('hideTokens', () => {

    it('empty, null, undefined', () => {
        expect(hideTokens('abc', [])).to.equal('abc');
        expect(hideTokens('abc', null)).to.equal('abc');
        expect(hideTokens('abc', undefined)).to.equal('abc');
    });

    it('one string', () => {
        expect(hideTokens('msg', ['s'])).to.equal('m*g');
    });

    it('one object, one field', () => {
        expect(hideTokens('msg', [{'s': '<SOME_STUFF>'}])).to.equal('m<SOME_STUFF>g');
    });

    it('one object, multiple fields', () => {
        expect(hideTokens('abcde', [{'a': '<A>', 'd': '<D>'}])).to.equal('<A>bc<D>e');
    });

    it('all together', () => {
        expect(hideTokens('abcdefg', ['a', {'b': '<B>', 'd': '<D>'}, {'e': '<E>'}, 'f'])).to.equal('*<B>c<D><E>*g');
    });

});