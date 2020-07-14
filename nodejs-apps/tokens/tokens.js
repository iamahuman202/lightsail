const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const body_parser = require("body-parser");

const debug = process.argv.slice(2)[0] == "dev";
const http_port = debug ? 30000 : 3011;

var tokens = {};
try {
    var data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "tokens.json")).toString('utf8'));
    tokens = data;
} catch (e) {
    console.log("[fs] file read error", e);
}

var express_api = express();
var http_server = http.Server(express_api);
express_api.use(body_parser.json());
express_api.use(
    body_parser.urlencoded({
        extended: true
    })
);
express_api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
// express_api.use(express.static("html"));
express_api.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({}, null, 3));
});
express_api.get("/:app_id", (req, res) => {
    var token = null;
    if (tokens.hasOwnProperty(req.params.app_id)) {
        token = tokens[req.params.app_id];
    } else res.status(404);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({
        "app_id": req.params.app_id,
        "token": token
    }, null, 3));
});
http_server.listen(http_port, _ => {
    console.log("[http] listening on", http_port);
});