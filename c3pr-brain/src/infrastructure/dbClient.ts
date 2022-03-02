import {MongoClient} from 'mongodb';
import config from "../config";


/*
// http://mongodb.github.io/node-mongodb-native/3.0/api/Server.html
export interface SocketOptions {
    // Reconnect on error. default:false
    autoReconnect?: boolean;
    // TCP Socket NoDelay option. default:true
    noDelay?: boolean;
    // TCP KeepAlive on the socket with a X ms delay before start. default:0
    keepAlive?: number;
    // TCP Connection timeout setting. default 0
    connectTimeoutMS?: number;
    // TCP Socket timeout setting. default 0
    socketTimeoutMS?: number;
}
*/


export default function dbClient(): Promise<MongoClient> {

    const db: Promise<MongoClient> = MongoClient.connect(config.c3pr.brain.mongoC3prUrl, {
        useNewUrlParser: true, // https://stackoverflow.com/a/51182415
        // Turn off all buffering, error immediately if disconnected
        bufferMaxEntries: 0,
        autoReconnect: true,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 60000,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1500,
        keepAlive: true
    }).catch(e => console.log(`Error on connect()`, e)) as Promise<MongoClient>;

    return db.then(client => {
        client.on('close', () => {
            console.log('-> db lost connection');
        });
        client.on('reconnect', () => {
            console.log('-> db reconnected');
        });
        return client;
    }).catch(e => console.log(`Error while connecting to C3PR database.`, e)) as Promise<MongoClient>;

    // https://thecodebarbarian.com/managing-connections-with-the-mongodb-node-driver.html

}