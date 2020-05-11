process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require("cluster");
const crypto = require("crypto");
const Worker = require("webworker-threads").Worker;

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  // setup worker
  const worker = new Worker(function () {
    // setup how to response postMessage from outside
    this.onmessage = function () {
      let counter = 0;
      while (counter < 1e9) {
        counter++;
      }
      // after finish calculation, send response to outside
      postMessage(counter);
    };
  });
  // set up what to do when receive the calculation result from worker
  worker.onmessage = function (message) {
    console.log(message.data);
    res.send("" + message.data);
  };
  // send request to worker
  worker.postMessage();
});

app.get("/fast", (req, res) => {
  res.send("This is fast");
});

app.listen(3000);
