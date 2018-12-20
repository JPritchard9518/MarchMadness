const express = require('express');
const path = require('path');
const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");


const app = express();

// Point static path to dist
app.use('/', express.static(path.join(__dirname, '..', 'dist')));
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/build')))



const routes = require('./routes');
app.use('/', routes);
/** Get port from environment and store in Express. */
const port = process.env.PORT || '3000';
// app.set('port', port);

/** Create HTTP server. */
// const server = http.createServer(app);
/** Listen on provided port, on all network interfaces. */
// server.listen(port, () => console.log(`Server Running on port ${port}`));
const USER = 'MarchMadnessApp';
const PSSWRD = 'hymdyc-hysdyg-4pYmqe';
const url = `mongodb://${USER}:${PSSWRD}@ds151393.mlab.com:51393/march-madness`
dbClient = null;
initDB();
function initDB() {
    MongoClient.connect(url, {
        db: { w: -1 },
        server: { socketOptions: { keepAlive: 100 } }
    }, function (err, db) {
        if (err) {
            console.log("ERROR!!!!!!")
            return console.dir(err);
        }
        dbClient = db;
        http.createServer(app).listen(port, function () {
            console.log('Express server listening on port %s --- %s', port, (new Date()));
        });
    });
}
