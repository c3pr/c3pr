const c3prLOG4 = require('./').default;

c3prLOG4.testMode();

describe('c3prLOG4', () => {

    it('basic', () => {
        function goBasic() {
            c3prLOG4('basic message', {lcid: 'lcid', sha: "shaz", euuid: 'euuid'});
        }
        goBasic();
    });

    it('auto-lcid', () => {
        c3prLOG4('auto-lcid', {lcid: c3prLOG4.lcid(), sha: "shaz", euuid: 'euuid'});
    });

});