import Queue from "bull";
import { ExpirationCompletionPublisher } from "../events/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
    orderId: string;
}

//enqueue a job
const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: 'expiration-redis-srv'
    }
});

//get back the job
expirationQueue.process(async (job) => {
    await new ExpirationCompletionPublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
});


export { expirationQueue };