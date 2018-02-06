const handleChanges = require('../application/handleChanges');

module.exports = function (app) {

    app.post('/changes', function (request, response) {
        console.log("\n\nChanges received:");
        console.log(request.body);
        console.log("\n\n------------------------\n\n");
        handleChanges(request.body);
        console.log("\n\n------------------------\n\n");

        response.send('Ok, that would be all, thanks.');
    });

};