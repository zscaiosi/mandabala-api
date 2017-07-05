let express = require('express');
let bodyParser = require('body-parser');

module.exports = function(){
    let app = express();
    app.use(bodyParser);

    return app;
}