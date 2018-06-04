import {createChangesCommitted} from "./createChangesCommitted";
import {emitChangesCommitted} from "./emitChangesCommitted";


async function createAndEmitChangesCommitted(webhookPayload) {
    const changesCommitted = await createChangesCommitted(webhookPayload);
    // if (changesCommitted === null) {
    //     // no changed_files
    //     return;
    // }
    return emitChangesCommitted(changesCommitted);
}

export { createAndEmitChangesCommitted };
