import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

class BaseListener<T extends Event> {
  subject: T['subject'];
  queueGroupName: string;
  protected client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan, subject: T['subject'], queueGroupName: string) {
    this.client = client;
    this.subject = subject;
    this.queueGroupName = queueGroupName;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }

  onMessage(data: T['data'], msg: Message): void {
    // To be implemented in the derived classes
  }
}

export function createListener<T extends Event>(
  client: Stan,
  subject: T['subject'],
  queueGroupName: string,
  onMessage: (data: T['data'], msg: Message) => void
) {
  const listener = new BaseListener<T>(client, subject, queueGroupName);
  listener.onMessage = onMessage;
  return listener;
}
