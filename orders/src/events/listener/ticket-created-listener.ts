import { Message, Stan } from 'node-nats-streaming';
import { Subjects, TicketCreatedEvent, createListener } from '@satickserv/common';
import { Ticket } from '../../model/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener {
  private listener;

  constructor(client: Stan) {
    this.listener = createListener<TicketCreatedEvent>(
      client,
      Subjects.TicketCreated,
      queueGroupName,
      this.onMessage.bind(this)
    );
  }

  listen(): void {
    this.listener.listen();
  }

  private async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    console.log("ticket price and title", title, price);
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}