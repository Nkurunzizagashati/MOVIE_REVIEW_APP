import express from "express";
import "express-async-errors";
import userRouter from "./routes/user.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errors.js";

connectDB();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
dotenv.config({ path: "./config.env" });
// ROUTES

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("<h1>HELLO FROM THE SERVER</h1>");
});
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`THE SERVER IS LISTENING ON PORT ${PORT}`);
});
