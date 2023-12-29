import { OrderCreatedListener } from './events/listener/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  try {

    await natsWrapper.connect('ticketing', '12345', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
   
    //listening to the orders created and cancellation
    new OrderCreatedListener(natsWrapper.client).listen();
    console.log("Connected to database Successfully.")
  } catch (error) {
    console.log("Error connecting to database 500 internal server error", error)
  }
};

start();