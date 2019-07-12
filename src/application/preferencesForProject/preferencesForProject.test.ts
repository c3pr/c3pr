import {ImportMock} from 'ts-mock-imports';
import {expect} from 'chai';
import preferencesForProject from "./preferencesForProject";
import * as eventsDBModule from "../events/eventsDB";


const ppus = [
    {
        project_clone_url: 'http://git.example.com/some-project.git',
        event_type: 'ProjectPreferencesUpdated',
        command: 'UPDATE_WEIGHT_PROJECT_WIDE',
        arguments: {
            tool_id: 'tool:a',
            amount: -1
        }
    },
    {
        project_clone_url: 'http://git.example.com/some-project.git',
        event_type: 'ProjectPreferencesUpdated',
        command: 'UPDATE_WEIGHT_PER_FILE',
        arguments: {
            tool_id: 'tool:a',
            file_path: 'src/main/java/com/example/Main.java',
            amount: -6
        }
    },
    {
        project_clone_url: 'http://git.example.com/some-project.git',
        event_type: 'ProjectPreferencesUpdated',
        command: 'UPDATE_WEIGHT_PER_FILE',
        arguments: {
            tool_id: 'tool:a',
            file_path: 'src/main/java/com/example/Main.java',
            amount: -4
        }
    },
    {
        project_clone_url: 'http://git.example.com/some-project.git',
        event_type: 'ProjectPreferencesUpdated',
        command: 'DISABLE_TOOL_PROJECT_WIDE',
        arguments: {
            tool_id: 'tool:b'
        }
    },
    {
        project_clone_url: 'http://git.example.com/some-project.git',
        event_type: 'ProjectPreferencesUpdated',
        command: 'DISABLE_TOOL_PER_FILE',
        arguments: {
            tool_id: 'tool:c',
            file_path: 'src/main/java/com/example/Main.java'
        }
    }
];

describe('preferencesForProject', function () {
    let eventsDBMockManager;
    beforeEach('mock setup', () => eventsDBMockManager = ImportMock.mockStaticClass(eventsDBModule));
    afterEach('mock teardown', () => eventsDBMockManager.restore());


    it('preferencesForProject', async function () {
        eventsDBMockManager.mock('findAll', Promise.resolve(ppus));

        const expectedPrefs = {
            project_wide: {
                'tool:a': {
                    weight_modification: -1,
                    enabled: true
                },
                'tool:b': {
                    weight_modification: 0,
                    enabled: false
                }
            },
            per_file: {
                'src/main/java/com/example/Main.java': {
                    'tool:a': {
                        weight_modification: -10,
                        enabled: true
                    },
                    'tool:c': {
                        weight_modification: 0,
                        enabled: false
                    }
                }
            }
        };
        let actualPrefs = await preferencesForProject('http://git.example.com/some-project.git');

        expect(actualPrefs).to.deep.equal(expectedPrefs);
    });
});