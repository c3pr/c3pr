import {expect} from 'chai';

import eventsDBFake from '../../../test/application/eventsDBFake';
import generateProjectPreferences from "./generateProjectPreferences";


describe('generateProjectPreferences', () => {

    beforeEach(eventsDBFake.load);
    afterEach(eventsDBFake.unload);

    it('handle file rename', async () => {
        // setup:
        const expectedPrefs = {
            project_wide: {},
            per_file: {
                "src/f1.js": {
                    "tool:weight_modified": {
                        enabled: true,
                        weight_modification: -100
                    }
                }
            },
            open_prs: {}
        };
        eventsDBFake.setOptions({cutTime: "2000-01-01T00:02:00.000Z"});

        // execute:
        let actualPrefs = await generateProjectPreferences('http://git.foo/bar.git');

        // verify:
        expect(actualPrefs).to.deep.equal(expectedPrefs);
    }).timeout(2_000);

    it('handle open PR', async () => {
        // setup:
        const expectedPrefs = {
            project_wide: {},
            per_file: {
                "src/f1.js": {
                    "tool:weight_modified": {
                        enabled: true,
                        weight_modification: -100
                    }
                }
            },
            open_prs: {
                "src/f1.js": [
                    1007
                ]
            }
        };
        eventsDBFake.setOptions({cutTime: "2000-01-01T00:07:00.000Z"});

        // execute:
        let actualPrefs = await generateProjectPreferences('http://git.foo/bar.git');

        // verify:
        expect(actualPrefs).to.deep.equal(expectedPrefs);
    }).timeout(2_000);

    it('handle open and then closed PR', async () => {
        // setup:
        const expectedPrefs = {
            project_wide: {},
            per_file: {
                "src/f1.js": {
                    "tool:weight_modified": {
                        enabled: true,
                        weight_modification: -100
                    },
                    "tool:t1": {
                        enabled: true,
                        weight_modification: 1
                    }
                }
            },
            open_prs: {}
        };
        eventsDBFake.setOptions({cutTime: "2000-01-01T00:08:00.000Z"});

        // execute:
        let actualPrefs = await generateProjectPreferences('http://git.foo/bar.git');

        // console.log(JSON.stringify(actualPrefs, null, '  '));

        // verify:
        expect(actualPrefs).to.deep.equal(expectedPrefs);
    }).timeout(2_000);

});