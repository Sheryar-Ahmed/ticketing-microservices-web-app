import { Message, Stan } from 'node-nats-streaming';
import { OrderCreatedEvent, Subjects, createListener } from '@satickserv/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queue/expiration-queue';


export class OrderCreatedListener {
  private listener;

  constructor(client: Stan) {
    this.listener = createListener<OrderCreatedEvent>(
      client,
      Subjects.OrderCreated,
      queueGroupName,
      this.onMessage.bind(this)
    );
  }

  listen(): void {
    this.listener.listen();
  }

  private async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //calculation of delay to process the job
    const delay = new Date(data.expiresAt).getTime()- new Date().getTime();
    console.log("Waiting for the delay to process the job about", delay);
    //enqueue the order job
    await expirationQueue.add({
      orderId: data.id
    },
    {
      delay
    })
    //acknowlegement that the message is done.
    msg.ack();
  }
}