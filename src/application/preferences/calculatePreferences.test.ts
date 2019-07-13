import {ImportMock} from 'ts-mock-imports';
import {expect} from 'chai';
import calculatePreferences from "./calculatePreferences";
import * as eventsDBModule from "../events/eventsDB";


const project_clone_url = 'http://git.example.com/some-project.git';
const ppus = [
    {
        project_clone_url,
        event_type: 'ProjectPreferencesUpdated',
        command: 'UPDATE_WEIGHT_PROJECT_WIDE',
        arguments: {tool_id: 'tool:a', amount: -1}
    },
    {
        project_clone_url,
        event_type: 'ProjectPreferencesUpdated',
        command: 'UPDATE_WEIGHT_PER_FILE',
        arguments: {tool_id: 'tool:a', file_path: 'src/main/java/com/example/Main.java', amount: -6}
    },
    {
        project_clone_url,
        event_type: 'ProjectPreferencesUpdated',
        command: 'UPDATE_WEIGHT_PER_FILE',
        arguments: {tool_id: 'tool:a', file_path: 'src/main/java/com/example/Main.java', amount: -4}
    },
    {
        project_clone_url,
        event_type: 'ProjectPreferencesUpdated',
        command: 'DISABLE_TOOL_PROJECT_WIDE',
        arguments: {tool_id: 'tool:b'}
    },
    {
        project_clone_url,
        event_type: 'ProjectPreferencesUpdated',
        command: 'DISABLE_TOOL_PER_FILE',
        arguments: {tool_id: 'tool:c', file_path: 'src/main/java/com/example/Main.java'}
    },
    {
        project_clone_url,
        event_type: 'ProjectPreferencesUpdated',
        command: 'DISABLE_TOOL_PER_FILE',
        arguments: {tool_id: 'tool:d', file_path: 'src/main/java/com/example/Main.java'}
    },
    {
        project_clone_url,
        event_type: 'ProjectPreferencesUpdated',
        command: 'ENABLE_TOOL_PER_FILE',
        arguments: {tool_id: 'tool:d', file_path: 'src/main/java/com/example/Main.java'}
    },
    {
        project_clone_url,
        event_type: 'ProjectPreferencesUpdated',
        command: 'DISABLE_TOOL_PROJECT_WIDE',
        arguments: {tool_id: 'tool:e'}
    },
    {
        project_clone_url,
        event_type: 'ProjectPreferencesUpdated',
        command: 'ENABLE_TOOL_PROJECT_WIDE',
        arguments: {tool_id: 'tool:e'}
    }
];

describe('calculatePreferences', function () {
    let eventsDBMockManager;
    beforeEach('mock setup', () => eventsDBMockManager = ImportMock.mockStaticClass(eventsDBModule));
    afterEach('mock teardown', () => eventsDBMockManager.restore());


    it('calculatePreferences', async function () {
        eventsDBMockManager.mock('findAll', Promise.resolve(ppus));

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
        let actualPrefs = await calculatePreferences('http://git.example.com/some-project.git');

        expect(actualPrefs).to.deep.equal(expectedPrefs);
    });
});