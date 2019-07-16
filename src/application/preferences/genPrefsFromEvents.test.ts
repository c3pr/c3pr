import {ImportMock} from 'ts-mock-imports';
import {expect} from 'chai';
import * as eventsDBModule from "../events/eventsDB";
import * as utilsModule from "../../infrastructure/utils";
import {ProjectPreferences} from "./ProjectPreferences";
import genPrefsFromEvents from "./genPrefsFromEvents";


function resolve(path, obj = self, separator = '.') {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

function findAll(query) {
    let events = require('G:/MSc-Tools/c3pr/c3pr-analytics/events.json');
    return events.filter(e => {
        for (const key of Object.keys(query)) {
            if (query[key] !== resolve(key, e)) return false;
        }
        return true;
    });
}

describe('genPrefsFromEvents', () => {
    let eventsDBMockManager, utilsMockManager;
    beforeEach('mock setup', () => {
        eventsDBMockManager = ImportMock.mockStaticClass(eventsDBModule);
        utilsMockManager = ImportMock.mockStaticClass(utilsModule);
    });
    afterEach('mock teardown', () => {
        eventsDBMockManager.restore();
        utilsMockManager.restore();
    });

    it('genPrefsFromEvents', async () => {
        eventsDBMockManager.replace('findAll', findAll);

        const expectedPrefs = {
            project_wide: {
                'tool:a': {enabled: true, weight_modification: -1},
                'tool:b': {enabled: false, weight_modification: 0},
                'tool:e': {enabled: true, weight_modification: 0}
            },
            per_file: {
                'src/main/java/com/example/Main.java': {
                    'tool:a': {enabled: true, weight_modification: -10},
                    'tool:c': {enabled: false, weight_modification: 0},
                    'tool:d': {enabled: true, weight_modification: 0}
                }
            }
        };
        let commands = await genPrefsFromEvents('http://git.example.com/essteeai/sagas2.git');

        let actualPrefs: ProjectPreferences = {project_wide: {}, per_file: {}, open_prs: {}};
        commands.forEach(ap => {
            actualPrefs = ap.apply(actualPrefs);
        });


        console.log(commands.length);

        expect(actualPrefs).to.deep.equal(expectedPrefs);
    }).timeout(100000);
});