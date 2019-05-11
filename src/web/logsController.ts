import {findAllLogsForEuuidGraph, findLogsBy} from "../application/logs/logsDB";

const authExpressMiddleware = require("../application/auth/authExpressMiddleware");

export = function (app) {

    app.use('/api/v1/logs', authExpressMiddleware);

    app.get('/api/v1/logs', function ({query}, response) {
        findLogsBy(query).then((logs) => {
            response.status(200).send(logs);
        }).catch((e) => {
            response.status(500).send(e.toString());
        });
    });

    app.get('/api/v1/logs/euuid/:euuid/', async function ({params: {euuid}}, response) {
        try {
            let logs = await findAllLogsForEuuidGraph(euuid);
            response.status(200).send(logs);
        } catch (e) {
            response.status(500).send(e.toString());
        }
    });

};
