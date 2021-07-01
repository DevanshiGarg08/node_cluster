const express = require("express");

const app = express();

const cluster = require("cluster");

const os = require("os");

const numCPU = os.cpus().length;

app.get("/", (req, res) => {
  for (let i = 0; i < 50000; i++) {}

  res.send(console.log(`Success at ${process.pid}`));

  cluster.worker.kill();
});

if (cluster.isMaster) {
  for (let i = 0; i < numCPU; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(8080, () => {
    console.log(`Server ${process.pid} started at 8080`);
  });
}
