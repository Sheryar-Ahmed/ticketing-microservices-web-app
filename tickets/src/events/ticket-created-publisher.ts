import { Stan } from 'node-nats-streaming';
import { createPublisher } from '@satickserv/common';
import { TicketCreatedEvent } from '@satickserv/common';
import { Subjects } from '@satickserv/common';
export class TicketCreatedPublisher {
  private publisher;

  constructor(client: Stan) {
    this.publisher = createPublisher<TicketCreatedEvent>(client, Subjects.TicketCreated);
  }

  publish(data: TicketCreatedEvent['data']): Promise<void> {
    return this.publisher.publish(data);
  }
}
