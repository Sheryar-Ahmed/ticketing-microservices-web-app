import { Message, Stan } from 'node-nats-streaming';
import { OrderCreatedEvent, Subjects, createListener } from '@satickserv/common';
import { Ticket } from '../../model/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../ticket-updated-publisher';

export class OrderCreatedListener {
  private listener;
  private client: Stan;

  constructor(client: Stan) {
    this.client = client; 
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
    //In order to reserve a ticket, we are basically adding an orderID to it.if the ticket has an orderID that means it is reserved.
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket Not Found");
    }

    ticket.set({
      orderId: data.id
    });

    await ticket.save();
    //event to publish to publish that the ticket is updated so that the version is also updated to the orders
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    msg.ack();
  }
}