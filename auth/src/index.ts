import express from "express";
import { json } from "body-parser";
import { authRouter } from "./routes/auth";
import mongoose from 'mongoose';

const app = express();
app.use(json());

app.use(authRouter);

const start = async() => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log("Connected to database Successfully.")
  } catch (error) {
    console.log("Error connecting to database 500 internal server error", error)
  }
};


app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});

start();