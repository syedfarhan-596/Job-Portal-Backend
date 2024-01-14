// installed packages imports
const express = require("express");
require("express-async-errors");
require("dotenv").config();
const ErrorHandlerMiddleware = require("./middlewares/error-handler");
const cors = require("cors");
const helmet = require("helmet");

//application imports
const connectDB = require("./db/connect");
const NotFoundError = require("./erros/not-found");

//routes imports
const UserRoutes = require("./routes/user/user");
const CompanyRoutes = require("./routes/company/company");

//schemas
const JobSchema = require("./models/jobs/jobs");
const { StatusCodes } = require("http-status-codes");
const Company = require("./models/company/company");

//app
const app = express();

app.use("/resume", express.static("./uploads/resume"));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/jobs", async (req, res) => {
  const { name, locaiton } = req.query;
  let QueryObject = {};
  if (name) {
    QueryObject.title = { $regex: name, $options: "i" };
  }
  if (locaiton) {
    QueryObject.location = { $regex: location, $options: "i" };
  }

  const jobs = await JobSchema.find(QueryObject).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, total: jobs.length });
});

app.get("/companies", async (req, res) => {
  const companies = await Company.find({}).select("name location industry");
  res.status(StatusCodes.OK).json(companies);
});

app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/company", CompanyRoutes);
//middleware
app.use(NotFoundError);
app.use(ErrorHandlerMiddleware);

const start = async () => {
  connectDB(process.env.MONGO_URI);
  app.listen(process.env.PORT, () =>
    console.log(`server is listening on port ${process.env.PORT}`)
  );
};

start();
