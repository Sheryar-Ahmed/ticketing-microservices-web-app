import { Stan } from 'node-nats-streaming';
import { createPublisher } from '@satickserv/common';
import { OrderCancelledEvent } from '@satickserv/common';
import { Subjects } from '@satickserv/common';


export class OrderCancelledPublisher {
  private publisher;

  constructor(client: Stan) {
    this.publisher = createPublisher<OrderCancelledEvent>(client, Subjects.OrderCancelled);
  }

  publish(data: OrderCancelledEvent['data']): Promise<void> {
    return this.publisher.publish(data);
  }
}
