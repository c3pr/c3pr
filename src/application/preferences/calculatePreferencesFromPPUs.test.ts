import {ImportMock} from 'ts-mock-imports';
import {expect} from 'chai';
import calculatePreferencesFromPPUs from "./calculatePreferencesFromPPUs";
import * as eventsDBModule from "../events/eventsDB";
import * as utilsModule from "../../infrastructure/utils";
import updatePreferences from "./updatePreferences";

describe('calculatePreferencesFromPPUs', () => {
    const project_clone_url = 'http://git.example.com/some-project.git';

    let eventsDBMockManager, utilsMockManager;
    beforeEach('mock setup', () => {
        eventsDBMockManager = ImportMock.mockStaticClass(eventsDBModule);
        utilsMockManager = ImportMock.mockStaticClass(utilsModule);
    });
    afterEach('mock teardown', () => {
        eventsDBMockManager.restore();
        utilsMockManager.restore();
    });

    it('calculatePreferencesFromPPUs', async () => {
        const ppus = [];
        eventsDBMockManager.replace('registerNewEventAsProcessed', (...a) => ppus.push({payload: a[1]}));
        eventsDBMockManager.mock('findAll', Promise.resolve(ppus));

        await updatePreferences.updateWeightProjectWide(project_clone_url, 'tool:a', -1);
        await updatePreferences.updateWeightPerFile(project_clone_url, 'src/main/java/com/example/Main.java', 'tool:a', -6);
        await updatePreferences.updateWeightPerFile(project_clone_url, 'src/main/java/com/example/Main.java', 'tool:a', -4);
        await updatePreferences.disableToolProjectWide(project_clone_url, 'tool:b');
        await updatePreferences.disableToolPerFile(project_clone_url, 'src/main/java/com/example/Main.java', 'tool:c');
        await updatePreferences.disableToolPerFile(project_clone_url, 'src/main/java/com/example/Main.java', 'tool:d');
        await updatePreferences.enableToolPerFile(project_clone_url, 'src/main/java/com/example/Main.java', 'tool:d');
        await updatePreferences.disableToolProjectWide(project_clone_url, 'tool:e');
        await updatePreferences.enableToolProjectWide(project_clone_url, 'tool:e');

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
        let actualPrefs = await calculatePreferencesFromPPUs('http://git.example.com/some-project.git');

        expect(actualPrefs).to.deep.equal(expectedPrefs);
    });
});