import express from "express";

import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import env from "./config/config.env.js";
import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
console.log(" ENV FILE:", `.env.${process.env.NODE_ENV || "development"}`);
console.log(" CLIENT_URL:", process.env.CLIENT_URL);

const app = express();

app.use(express.json());

connectDB();

app.use(cors({}));

app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

const PORT = process.env.PORT || env.PORT;

// app.listen(env.PORT, () => {
//   console.log(`Server is running on: http://localhost:${env.PORT}/api`);
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
