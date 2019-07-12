import eventsDB from "../events/eventsDB";

export default function preferencesForProject(cloneUrl: string) {
    const ppus = eventsDB.findAll({event_type: 'ProjectPreferencesUpdated', 'payload.clone_url': cloneUrl});
    return ppus;
}