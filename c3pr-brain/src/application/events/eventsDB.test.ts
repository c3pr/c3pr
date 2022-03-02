import { expect } from 'chai';
import eventsDB from "./eventsDB";

describe('eventsDB', function () {

    it('findAll', async () => {
        const rs = await eventsDB.findAll({event_type: 'ChangesCommitted'});
        for (let {event_type} of rs) {
            expect(event_type).to.equal("ChangesCommitted");
        }
    }).timeout(6 * 1000);

    after(async () => {
        await eventsDB.close();
    })

});