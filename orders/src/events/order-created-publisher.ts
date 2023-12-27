import { Stan } from 'node-nats-streaming';
import { createPublisher } from '@satickserv/common';
import { OrderCreatedEvent } from '@satickserv/common';
import { Subjects } from '@satickserv/common';


export class OrderCreatedTPublisher {
  private publisher;

  constructor(client: Stan) {
    this.publisher = createPublisher<OrderCreatedEvent>(client, Subjects.OrderCreated);
  }

  publish(data: OrderCreatedEvent['data']): Promise<void> {
    return this.publisher.publish(data);
  }
}
