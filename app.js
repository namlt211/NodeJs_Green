import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import UserRouter from "./api/routers/UserRouter.js";
import ProductRouter from "./api/routers/ProductRouter.js";
import MenuRouter from "./api/routers/MenuRouter.js";
import StatusManufactureRouter from "./api/routers/StatusManufactureRouter.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URL;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connect to successfully");
    app.listen(PORT, () => {
      console.log("running is port: " + PORT);
    });
  })
  .catch((err) => {
    console.log("connect failed. Error: " + err.message);
  });

//ROUTER
app.use("/", UserRouter);
app.use("/", ProductRouter);
app.use("/", MenuRouter);
app.use("/", StatusManufactureRouter);
