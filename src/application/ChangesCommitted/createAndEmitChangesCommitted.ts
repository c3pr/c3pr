import {createChangesCommitted} from "./createChangesCommitted";
import {emitChangesCommitted} from "./emitChangesCommitted";


async function createAndEmitChangesCommitted(webhookPayload) {
    const changesCommitted = await createChangesCommitted(webhookPayload);
    return emitChangesCommitted(changesCommitted);
}

export { createAndEmitChangesCommitted };
