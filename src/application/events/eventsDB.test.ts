// noinspection JSUnresolvedVariable
import { expect } from 'chai';

// const config = require('../../config');
// config.c3pr.hub.mongoEventsCollection += "-test";

const eventsDB = require('./eventsDB');

describe('eventsDB', function () {

    (it('perProjectEventCountOfType', async () => {
        const rs = await eventsDB.perProjectEventCountOfType('ChangesCommitted');
        for (let r of rs) {
            // noinspection BadExpressionStatementJS,JSUnresolvedVariable
            expect(r._id).to.be.ok;
            // noinspection BadExpressionStatementJS,JSUnresolvedVariable
            expect(r.count).to.be.ok;
            // noinspection BadExpressionStatementJS,JSUnresolvedVariable
            expect(r.last_modified).to.be.ok;
        }
        //console.log(JSON.stringify(rs, null, '\t'));
    }) as any).timeout(6 * 1000);

    afterAll(async () => {
        await eventsDB.close();
    })

});