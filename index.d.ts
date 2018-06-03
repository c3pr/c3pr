declare const hubClientConfig: {
    c3pr: {
        hub: {
            auth: {
                jwt: () => string;
            };
            c3prHubUrl: string;
            loginUrl: string;
            eventsUrl: (ignore: any) => string;
            projectsByCloneUrlHttp: (ignore: any) => string;
        };
    };
    init(C3PR_HUB_URL: string, jwt: () => string): void;
    headers(): {
        Authorization: string;
    };
};
export { hubClientConfig };
export * from './types/Event';
