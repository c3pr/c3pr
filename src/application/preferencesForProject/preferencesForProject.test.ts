import {ImportMock} from 'ts-mock-imports';
import {expect} from 'chai';
import preferencesForProject from "./preferencesForProject";
import * as eventsDBModule from "../events/eventsDB";

describe('preferencesForProject', function () {
    let eventsDBMockManager;
    beforeEach('mock setup', () => eventsDBMockManager = ImportMock.mockStaticClass(eventsDBModule));
    afterEach('mock teardown', () => eventsDBMockManager.restore());


    it('preferencesForProject', async function () {
        eventsDBMockManager.mock('findAll', Promise.resolve(
            [
                {
                    event_type: 'ProjectPreferencesUpdated'
                }
            ]
        ));

        const expectedPrefs = {
            project_wide: {
                'tool:a': {
                    weight: -1
                },
                'tool:b': {
                    disabled: true
                }
            },
            per_file: {
                'src/main/java/com/example/Main.java': {
                    'tool:a': {
                        weight: -10
                    },
                    'tool:c': {
                        disabled: true
                    }
                }
            }
        };
        let actualPrefs = await preferencesForProject('http://git.example.com/some-project.git');

        expect(actualPrefs).to.equal(expectedPrefs);
    });
});