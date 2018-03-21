const mongodb = require('mongodb');

let seedData = [
    {decade: '1970s', artist: 'Debby Boone', song: 'You Light Up My Life', weeksAtOne: 10},
    {decade: '1980s', artist: 'Olivia Newton-John', song: 'Physical', weeksAtOne: 10},
    {decade: '1990s', artist: 'Mariah Carey', song: 'One Sweet Day', weeksAtOne: 16}
];

let MONGO_LOGS_URI = process.env.MONGO_LOGS_URI;

mongodb.MongoClient.connect(MONGO_LOGS_URI, async function (err, client) {
    if (err) throw err;

    let db = client.db('c3pr');

    let songs = db.collection('songs');

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