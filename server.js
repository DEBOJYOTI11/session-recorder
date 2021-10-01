const http = require("http");
const express = require("express");
const hbs = require("express-handlebars");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const redis = require("redis");
const redisClient = redis.createClient()
const playbackRedis = redis.createClient()

const config = require('./config');
const sessionPlayback = require("./playback/server");
const sessionRecorder = require("./recorder/server");

const app = express();
app.set("port", config.port);
const server = http.createServer(app);
var expressWs = require('express-ws')(app, server);

app.use(bodyParser.json())
app.use(morgan("dev"));
app.use(cors());
app.use(compression());




app.use("/build", express.static("./build"));
app.use("/website", express.static("./website"));
app.ws("/recorder", sessionRecorder(redisClient));
app.ws("/playback/:playbackId", sessionPlayback(playbackRedis));
app.use("/playback/:playbackId", express.static("./example/playback"));
app.use("/playback", playbackHandler)
app.use("/recorder", express.static("./example/recorder"));
server.listen(app.get("port"), () => {
    console.log("Listining to port", app.get("port"))
});


app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
}));
app.set('view engine', 'hbs');


function playbackHandler(req, res) {
    redisClient.lrange("sessions", 0, -1, (err, data) => {
        console.log(data)
        redisClient.lrange("live", 0, -1, (err, livedata) => {
            res.render('playback', {
                data: {sessions:data,live:livedata}
            })
        })
    })

}