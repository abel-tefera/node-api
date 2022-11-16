const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

const { notFound, errorHandler } = require("./middleware/error");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth", require("./routes/Auth"));
app.use("/api/balance", require("./routes/Balance"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFound);
app.use(errorHandler);


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const connectDB = require("./db");

connectDB();

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
