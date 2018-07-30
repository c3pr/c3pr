const mongodb = require('mongodb');
const expect = require('chai').expect;
const c3prLOG4 = require('./').default;

const config = require('../src/config');

const testLogsCollection = config.c3pr.logger.collection + '-test';
c3prLOG4.testMode();




describe('c3prLOG4', () => {

    it('basic', () => {
        c3prLOG4('basic message', {lcid: 'lcid', euuid: 'euuid'});
    });

    it('auto-lcid', () => {
        c3prLOG4('auto-lcid', {lcid: c3prLOG4.lcid(), euuid: 'euuid'});
    });

});