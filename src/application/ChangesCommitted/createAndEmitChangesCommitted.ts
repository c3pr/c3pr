import {createChangesCommitted} from "./createChangesCommitted";
import {emitChangesCommitted} from "./emitChangesCommitted";


async function createAndEmitChangesCommitted(webhookPayload, {lcid, euuid}) {
    const changesCommitted = await createChangesCommitted(webhookPayload, {lcid, euuid});
    return emitChangesCommitted(changesCommitted, {lcid, euuid});
}

export { createAndEmitChangesCommitted };
