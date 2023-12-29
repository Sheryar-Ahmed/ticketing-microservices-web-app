import express from "express";
import { json } from "body-parser";
import mongoose from 'mongoose';
import cookieSession from "cookie-session";
import { natsWrapper } from './nats-wrapper';
import { OrderRouter } from "./routes/order";
import { TicketCreatedListener } from "./events/listener/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listener/ticket-updated-listener";
import { ExpirationCompletionListener } from "./events/listener/expiration-complete-listener";
const app = express();

app.set('trust proxy', true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: true
  }));

  //routes
app.use(OrderRouter);

const start = async () => {
  try {

    await natsWrapper.connect('ticketing', '123', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    //listners to ticket creation and updation
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompletionListener(natsWrapper.client).listen();
    
    await mongoose.connect('mongodb://orders-mongo-srv:27017/orders');
    console.log("Connected to database Successfully.")
  } catch (error) {
    console.log("Error connecting to database 500 internal server error", error)
  }
};


app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});

start();