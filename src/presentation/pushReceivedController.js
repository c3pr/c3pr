module.exports = function (app) {

    app.post('/pushes', function (request, response) {
        console.log("\n\nPushes received:");
        console.log(request.body);
        console.log("\n\n------------------------\n\n");
        response.send('Ok, thanks.');
    });

};