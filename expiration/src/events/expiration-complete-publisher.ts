import { Stan } from 'node-nats-streaming';
import { ExpirationCompleteEvent, createPublisher, Subjects } from '@satickserv/common';


export class ExpirationCompletionPublisher {
  private publisher;

  constructor(client: Stan) {
    this.publisher = createPublisher<ExpirationCompleteEvent>(client, Subjects.ExpirationComplete);
  }

  publish(data: ExpirationCompleteEvent['data']): Promise<void> {
    return this.publisher.publish(data);
  }
}
