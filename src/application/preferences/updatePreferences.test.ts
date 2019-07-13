import {ImportMock} from 'ts-mock-imports';
import {expect} from 'chai';
import updatePreferences, {PPU_ACTIONS, ProjectPreferencesUpdated} from "./updatePreferences";
import * as eventsDBModule from "../events/eventsDB";
import * as utilsModule from "../../infrastructure/utils";



describe('updatePreferences', () => {
    const project_clone_url = 'http://git.example.com/some-project.git';
    const uuid = 'fake-u-u-i-d';
    const timestamp = '2018-08-28T01:30:00.000Z';
    const event_type = ProjectPreferencesUpdated;

    let eventsDBMockManager, utilsMockManager;
    beforeEach('mock setup', () => {
        eventsDBMockManager = ImportMock.mockStaticClass(eventsDBModule);
        eventsDBMockManager.replace('insert', s => s);
        utilsMockManager = ImportMock.mockStaticClass(utilsModule);
        utilsMockManager.replace('uuid', () => uuid);
        utilsMockManager.replace('timestamp', () => timestamp);
    });
    afterEach('mock teardown', () => {
        eventsDBMockManager.restore();
        utilsMockManager.restore();
    });

    it('updateWeightProjectWide', async () => {
        let insertedPpu = await updatePreferences.updateWeightProjectWide(project_clone_url, 'tool:a', -1);
        expect(insertedPpu).to.deep.equal({
            project_clone_url,
            uuid,
            timestamp,
            event_type,
            command: PPU_ACTIONS.UPDATE_WEIGHT_PROJECT_WIDE,
            args: {tool_id: 'tool:a', weight_modification: -1}
        });
    });

    it('updateWeightPerFile', async () => {
        let insertedPpu = await updatePreferences.updateWeightPerFile(project_clone_url, 'src/index.js', 'tool:js', -6);
        expect(insertedPpu).to.deep.equal({
            project_clone_url,
            uuid,
            timestamp,
            event_type,
            command: PPU_ACTIONS.UPDATE_WEIGHT_PER_FILE,
            args: {file_path: 'src/index.js', tool_id: 'tool:js', weight_modification: -6}
        });
    });

    it('disableToolProjectWide', async () => {
        let insertedPpu = await updatePreferences.disableToolProjectWide(project_clone_url, 'tool:d');
        expect(insertedPpu).to.deep.equal({
            project_clone_url,
            uuid,
            timestamp,
            event_type,
            command: PPU_ACTIONS.DISABLE_TOOL_PROJECT_WIDE,
            args: {tool_id: 'tool:d'}
        });
    });

    it('disableToolPerFile', async () => {
        let insertedPpu = await updatePreferences.disableToolPerFile(project_clone_url, 'src/index2.js', 'tool:df');
        expect(insertedPpu).to.deep.equal({
            project_clone_url,
            uuid,
            timestamp,
            event_type,
            command: PPU_ACTIONS.DISABLE_TOOL_PER_FILE,
            args: {file_path: 'src/index2.js', tool_id: 'tool:df'}
        });
    });

    it('enableToolProjectWide', async () => {
        let insertedPpu = await updatePreferences.enableToolProjectWide(project_clone_url, 'tool:e');
        expect(insertedPpu).to.deep.equal({
            project_clone_url,
            uuid,
            timestamp,
            event_type,
            command: PPU_ACTIONS.ENABLE_TOOL_PROJECT_WIDE,
            args: {tool_id: 'tool:e'}
        });
    });

    it('enableToolPerFile', async () => {
        let insertedPpu = await updatePreferences.enableToolPerFile(project_clone_url, 'src/index3.js', 'tool:ef');
        expect(insertedPpu).to.deep.equal({
            project_clone_url,
            uuid,
            timestamp,
            event_type,
            command: PPU_ACTIONS.ENABLE_TOOL_PER_FILE,
            args: {file_path: 'src/index3.js', tool_id: 'tool:ef'}
        });
    });

});