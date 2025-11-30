require("dotenv").config();
const mongoose = require("mongoose");
const cluster = require("cluster");
const os = require("os");
const app = require("./app"); // <-- Import the Express app

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 4000;

// ---------- CLUSTER MODE ----------
if (cluster.isPrimary) {
  // PRIMARY: Only manages workers
  console.log(` Primary process started (PID: ${process.pid})`);
  console.log(` Starting ${numCPUs} worker processes...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  // WORKER: Connects to DB and starts listening
  // Removed all app definition/route code (now in app.js)

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Worker ${process.pid} connected to MongoDB`);
      // Start the imported app instance
      app.listen(PORT, () =>
        console.log(`Worker ${process.pid} running on port ${PORT}`)
      );
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
}