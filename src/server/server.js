console.log("Hello World!");

const express = require("express");
const { readFile } = require("fs");
const http = require("http");

const app = express();

app.use(express.static("${__dirname}/../client"));

const server = http.createServer(app);

server.on("error", function(err) {
    console.log(err);
});

server.listen(8080, function() {
    console.log("server is ready");
});

