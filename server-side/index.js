require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const httpStatusText = require("./src/utils/httpStatusText");
require("./src/utils/reminderScheduler");

const PORT = process.env.PORT || 5000;
/ * * * * DB * * * /;
const connectDB = require("./src/config/db");
/ * * * * End Db * * * * /;

/ * * * * Router imports * * * * /;

const registerationRouter = require("./src/routes/registration.routes");
const projectRouter = require("./src/routes/projects.routes");
const taskRouter = require("./src/routes/tasks.routes");
/ * * * * End Router imports * * * * /;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/ * * * Routes * * * /;

app.use("/auth", registerationRouter);
app.use("/projects", projectRouter);
app.use("/tasks", taskRouter);

/ * * * * End Routes * * * * /;

/ * * * Global MiddleWare * * * /;
app.all("/{*any}", (req, res, next) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "this resource is not avilable",
  });
});
// global error handlers
app.use((error, req, res, next) => {
  console.error("🔥 Global Error:", error);
  return res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    error: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(PORT, () =>
  console.log(`I am running on: http://localhost:${PORT}`)
);
