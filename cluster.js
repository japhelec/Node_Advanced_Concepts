process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require("cluster");
const crypto = require("crypto");

// Is this file being executed in master mode
if (cluster.isMaster) {
  //cause index.js to be executed again but in child mode
  cluster.fork();
} else {
  //I'm a child, I'm going to act like a server and do nothing else
  const express = require("express");
  const app = express();

  app.get("/", (req, res) => {
    crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
      res.send("Hi, there!");
    });
  });

  app.get("/fast", (req, res) => {
    res.send("This is fast");
  });

  app.listen(3000);
}
