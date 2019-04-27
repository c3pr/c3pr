import {expect} from 'chai';
import {createDeepObject} from "./testUtils";

describe('testUtils', () => {

    it('createDeepObject', async () => {

        const config2 = createDeepObject({
            'c3pr.auth.jwt': 'JWT-TOKEN!',
            'c3pr.hub.changesCommittedOfUuidUrl': 'changesCommittedOfUuidUrl->:uuid',
            'c3pr.hub.projectFilesUrl': 'projectFilesUrl->:project_uuid'
        });

        const config = {
            c3pr: {
                auth: {
                    jwt: 'JWT-TOKEN!'
                },
                hub: {
                    changesCommittedOfUuidUrl: 'changesCommittedOfUuidUrl->:uuid',
                    projectFilesUrl: 'projectFilesUrl->:project_uuid'
                }
            }
        };
        expect(config).to.deep.equal(config2);
    });

});

