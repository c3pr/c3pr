import {ImportMock} from 'ts-mock-imports';
import {expect} from 'chai';
import updatePreferences, {PPU_ACTIONS, ProjectPreferencesUpdated} from "./updatePreferences";
import * as eventsDBModule from "../events/eventsDB";
import * as utilsModule from "../../infrastructure/utils";



describe('updatePreferences', () => {
    const clone_url_http = 'http://git.example.com/some-project.git';
    const uuid = 'fake-u-u-i-d';
    const timestamp = '2018-08-28T01:30:00.000Z';
    const event_type = ProjectPreferencesUpdated;

    let eventsDBMockManager, utilsMockManager;
    beforeEach('mock setup', () => {
        eventsDBMockManager = ImportMock.mockStaticClass(eventsDBModule);
        eventsDBMockManager.replace('registerNewEventAsProcessed', (...a) => a);
        utilsMockManager = ImportMock.mockStaticClass(utilsModule);
        utilsMockManager.replace('uuid', () => uuid);
        utilsMockManager.replace('timestamp', () => timestamp);
    });
    afterEach('mock teardown', () => {
        eventsDBMockManager.restore();
        utilsMockManager.restore();
    });

    it('updateWeightProjectWide', async () => {
        let insertedPpu = await updatePreferences.updateWeightProjectWide(clone_url_http, 'tool:a', -1, 'someReason');
        expect(insertedPpu).to.deep.equal([
            "ProjectPreferencesUpdated",
            {
                repository: {clone_url_http},
                command: PPU_ACTIONS.UPDATE_WEIGHT_PROJECT_WIDE,
                args: {tool_id: 'tool:a', weight_modification: -1, reason: 'someReason'}
            }
        ]);
    });

    it('updateWeightPerFile', async () => {
        let insertedPpu = await updatePreferences.updateWeightPerFile(clone_url_http, 'src/index.js', 'tool:js', -6, 'someReason1');
        expect(insertedPpu).to.deep.equal([
            "ProjectPreferencesUpdated",
            {
                repository: {clone_url_http},
                command: PPU_ACTIONS.UPDATE_WEIGHT_PER_FILE,
                args: {file_path: 'src/index.js', tool_id: 'tool:js', weight_modification: -6, reason: 'someReason1'}
            }
        ]);
    });

    it('disableToolProjectWide', async () => {
        let insertedPpu = await updatePreferences.disableToolProjectWide(clone_url_http, 'tool:d', 'someReason2');
        expect(insertedPpu).to.deep.equal([
            "ProjectPreferencesUpdated",
            {
                repository: {clone_url_http},
                command: PPU_ACTIONS.DISABLE_TOOL_PROJECT_WIDE,
                args: {tool_id: 'tool:d', reason: 'someReason2'}
            }
        ]);
    });

    it('disableToolPerFile', async () => {
        let insertedPpu = await updatePreferences.disableToolPerFile(clone_url_http, 'src/index2.js', 'tool:df', 'someReason3');
        expect(insertedPpu).to.deep.equal([
            "ProjectPreferencesUpdated",
            {
                repository: {clone_url_http},
                command: PPU_ACTIONS.DISABLE_TOOL_PER_FILE,
                args: {file_path: 'src/index2.js', tool_id: 'tool:df', reason: 'someReason3'}
            }
        ]);
    });

    it('enableToolProjectWide', async () => {
        let insertedPpu = await updatePreferences.enableToolProjectWide(clone_url_http, 'tool:e', 'someReason4');
        expect(insertedPpu).to.deep.equal([
            "ProjectPreferencesUpdated",
            {
                repository: {clone_url_http},
                command: PPU_ACTIONS.ENABLE_TOOL_PROJECT_WIDE,
                args: {tool_id: 'tool:e', reason: 'someReason4'}
            }
        ]);
    });

    it('enableToolPerFile', async () => {
        let insertedPpu = await updatePreferences.enableToolPerFile(clone_url_http, 'src/index3.js', 'tool:ef', 'someReason5');
        expect(insertedPpu).to.deep.equal([
            "ProjectPreferencesUpdated",
            {
                repository: {clone_url_http},
                command: PPU_ACTIONS.ENABLE_TOOL_PER_FILE,
                args: {file_path: 'src/index3.js', tool_id: 'tool:ef', reason: 'someReason5'}
            }
        ]);
    });

});