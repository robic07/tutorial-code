import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import { handleInvalidToken, notFound } from "./middleware/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const API_VERSION = process.env.API_VERSION;
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.get(`/${API_VERSION}`, (req, res) => {
  res.send("API Gateway is running....");
});

// Add Routes here
app.use(`/api/users`, userRoutes);

app.use(notFound);
app.use(handleInvalidToken);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
