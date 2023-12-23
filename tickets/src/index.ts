import express from "express";
import { json } from "body-parser";
import mongoose from 'mongoose';
import cookieSession from "cookie-session";
import { TicketRouter } from "./routes/ticket";

const app = express();

app.set('trust proxy', true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: true
  }));

app.use(TicketRouter);

const start = async () => {
  try {
    await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets');
    console.log("Connected to database Successfully.")
  } catch (error) {
    console.log("Error connecting to database 500 internal server error", error)
  }
};


app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});

start();