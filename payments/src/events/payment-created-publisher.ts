import { Stan } from 'node-nats-streaming';
import { PaymentCreatedEvent, createPublisher } from '@satickserv/common';
import { Subjects } from '@satickserv/common';

export class PaymentCreatedPublisher {
  private publisher;

  constructor(client: Stan) {
    this.publisher = createPublisher<PaymentCreatedEvent>(client, Subjects.PaymentCreated);
  }

  publish(data: PaymentCreatedEvent['data']): Promise<void> {
    return this.publisher.publish(data);
  }
}
