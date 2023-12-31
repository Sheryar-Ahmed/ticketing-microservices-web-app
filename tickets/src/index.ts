import express from "express";
import { json } from "body-parser";
import mongoose from 'mongoose';
import cookieSession from "cookie-session";
import { TicketRouter } from "./routes/ticket";
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from "./events/listener/order-created-listener";
import { OrderCancelledListener } from "./events/listener/order-cancelled-listener";

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

    await natsWrapper.connect('ticketing', '1234', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
   
    //listening to the orders created and cancellation
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

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