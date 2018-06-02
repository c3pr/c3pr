import index from '.';
import { hubClientConfig } from "../index";


hubClientConfig.init('http://example.com', () => 'yo');

// noinspection JSUnusedLocalSymbols
index.fetchProjectUuidForCloneUrl = function (clone_url_http: string): Promise<string> {
    return null;
};


