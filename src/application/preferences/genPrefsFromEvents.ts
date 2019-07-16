import {UpdatePresCommand} from "./ProjectPreferences";
import genPrefsFromPRCs from "./genPrefsFromPRCs";
import genPrefsFromPRUs from "./genPrefsFromPRUs";
import genPrefsFromPPUs from "./genPrefsFromPPUs";

export default async function genPrefsFromEvents(clone_url_http: string): Promise<UpdatePresCommand[]> {
    const prcs = await genPrefsFromPRCs(clone_url_http);
    const prus = await genPrefsFromPRUs(clone_url_http);
    const ppus = await genPrefsFromPPUs(clone_url_http);
    return [...prcs, ...prus, ...ppus];
}