import {createDeepObject, simpleAxiosMock} from "../testUtils";
import {fetchProjectFiles} from '../../src/adapters/fetchProjectFiles';
import {expect} from 'chai';

process.env.NODE_ENV = 'test';

describe('fetchProjectFiles', () => {

    it('a', async () => {

        const config = createDeepObject({
            'c3pr.auth.jwt': 'JWT-TOKEN!',
            'c3pr.hub.changesCommittedOfUuidUrl': 'changesCommittedOfUuidUrl->:uuid',
            'c3pr.hub.projectFilesUrl': 'projectFilesUrl->:project_uuid'
        });

        const axiosMock = simpleAxiosMock([
            {data: {payload: {project_uuid: 'I_am_project_uuid'}}},
            {data: 'ActualProjectFiles'}
        ]);

        let result = await fetchProjectFiles(config)(axiosMock)('I_am_changes_committed_root');

        expect(axiosMock.calledArguments).to.deep.equal([
            ["changesCommittedOfUuidUrl->I_am_changes_committed_root", {"headers": {"Authorization": "Bearer JWT-TOKEN!"}}],
            ["projectFilesUrl->I_am_project_uuid", {"headers": {"Authorization": "Bearer JWT-TOKEN!"}}]
        ]);
        expect(result).to.deep.equal("ActualProjectFiles");
    });

});

