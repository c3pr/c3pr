import {createChangesCommitted} from "./createChangesCommitted";
import {emitChangesCommitted} from "./emitChangesCommitted";


async function createAndEmitChangesCommitted(webhookPayload, {lcid, sha, euuid}) {
    const changesCommitted = await createChangesCommitted(webhookPayload, {lcid, sha, euuid});
    return emitChangesCommitted(changesCommitted, {lcid, sha, euuid});
}

export { createAndEmitChangesCommitted };
