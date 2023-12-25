import { Stan } from 'node-nats-streaming';
import { createPublisher } from '@satickserv/common';
import { TicketUpdatedEvent } from '@satickserv/common';
import { Subjects } from '@satickserv/common';
export class TicketUpdatedPublisher {
  private publisher;

  constructor(client: Stan) {
    this.publisher = createPublisher<TicketUpdatedEvent>(client, Subjects.TicketUpdated);
  }

  publish(data: TicketUpdatedEvent['data']): Promise<void> {
    return this.publisher.publish(data);
  }
}
