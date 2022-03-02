import {createChangesCommitted} from "./createChangesCommitted";
import {emitChangesCommitted} from "./emitChangesCommitted";


async function createAndEmitChangesCommitted(webhookPayload, c3prLOG5) {
    const changesCommitted = await createChangesCommitted(webhookPayload, c3prLOG5);
    return emitChangesCommitted(changesCommitted, c3prLOG5);
}

export { createAndEmitChangesCommitted };
