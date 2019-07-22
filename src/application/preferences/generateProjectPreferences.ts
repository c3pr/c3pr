import {ProjectPreferences} from "./ProjectPreferences";
import genPrefsFromEvents from "./genPrefsFromEvents";

export default async function generateProjectPreferences(clone_url_http: string): Promise<ProjectPreferences> {
    let commands = await genPrefsFromEvents(clone_url_http);
    return commandsToPreferences(commands);
}

export function commandsToPreferences(commands) {
    let actualPrefs: ProjectPreferences = {project_wide: {}, per_file: {}, open_prs: {}};
    commands.forEach(ap => {
        actualPrefs = ap.apply(actualPrefs);
    });

    return actualPrefs;
}
