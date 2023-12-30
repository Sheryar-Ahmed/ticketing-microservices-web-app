import express, { Request, Response } from "express";
import { json } from "body-parser";
import mongoose from 'mongoose';
import cookieSession from "cookie-session";
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listene";
import { chargeRouter } from "./routes/payment";

const app = express();

app.set('trust proxy', true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: true
  }));

app.use(chargeRouter);
//home page
app.get('/api/payments', (req: Request, res: Response) => {
  res.send({ message: "api/payments is working for pyaments" });
})

const start = async () => {
  try {
    if (!process.env.STRIPE_key) {
      console.log("Stripe secret is not found");
    }
    await natsWrapper.connect('ticketing', '1234567', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    //listening to the orders created and cancellation
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect('mongodb://payments-mongo-srv:27017/payments');
    console.log("Connected to database Successfully.")
  } catch (error) {
    console.log("Error connecting to database 500 internal server error", error)
  }
};


app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});

start();