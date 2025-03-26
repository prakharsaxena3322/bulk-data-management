import express, { json } from "express";
import recordRoutes from "./routes/recordRoutes.js";
import { sync } from "./db.js";
import setupSwaggerDocs from "./swagger.js";

const app = express();

// Middleware
app.use(json());

// Routes
app.use("/api/records", recordRoutes);
setupSwaggerDocs(app);

let server; // Hold the server instance

// Start server
const startServer = (port = 3000) => {
  return new Promise((resolve, reject) => {
    sync()
      .then(() => {
        console.log("Database connected");
        server = app.listen(port, () => {
          console.log(`Server running on http://localhost:${port}`);
          resolve(server); // Resolve the promise when the server starts
        });
      })
      .catch((err) => {
        console.error("Database connection failed:", err);
        reject(err); // Reject the promise if there's an error
      });
  });
};

const stopServer = () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        console.log("Server stopped");
        resolve();
      });
    } else {
      resolve();
    }
  });
};
startServer(3000);

export { app, startServer, stopServer };
