const mongodb = require('mongodb');
const config = require('./config');

let seedData = [
    {decade: '1970s', artist: 'Debby Boone', song: 'You Light Up My Life', weeksAtOne: 10},
    {decade: '1980s', artist: 'Olivia Newton-John', song: 'Physical', weeksAtOne: 10},
    {decade: '1990s', artist: 'Mariah Carey', song: 'One Sweet Day', weeksAtOne: 16}
];

mongodb.MongoClient.connect(config.c3pr.logger.mongoUrl, async function (err, client) {
    if (err) throw err;

    let db = client.db(config.c3pr.logger.database);

    let songs = db.collection(config.c3pr.logger.collection + "-demo");

    let result = await songs.insertMany(seedData);

    await songs.updateOne({song: 'One Sweet Day'}, {$set: {artist: 'Mariah Carey ft. Boyz II Men'}});

    songs.find({weeksAtOne: {$gte: 10}}).sort({decade: 1}).toArray(function (err, docs) {

        if (err) throw err;

        docs.forEach(function (doc) {
            console.log(
                'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] +
                ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
            );
        });

        client.close(function (err) {
            if (err) throw err;
        });

    });

});