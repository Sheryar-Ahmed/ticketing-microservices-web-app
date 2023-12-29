import { natsWrapper } from './nats-wrapper';

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

    console.log("Connected to database Successfully.")
  } catch (error) {
    console.log("Error connecting to database 500 internal server error", error)
  }
};

start();