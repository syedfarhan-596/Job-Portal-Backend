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

//job service class import
const UserJobs = require("./services/user/user-jobs");
const Userservices = require("./services/user/user-services");

//app
const app = express();

app.use("/resume", express.static("./uploads/resume"));
app.use("/companylogo", express.static("./uploads/companylogo"));
app.use(cors());
app.use(helmet());
app.use(express.json());

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
