import { Message, Stan } from 'node-nats-streaming';
import { Subjects, TicketUpdatedEvent, createListener } from '@satickserv/common';
import { Ticket } from '../../model/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener {
    private listener;

    constructor(client: Stan) {
        this.listener = createListener<TicketUpdatedEvent>(
            client,
            Subjects.TicketUpdated,
            queueGroupName,
            this.onMessage.bind(this)
        );
    }

    listen(): void {
        this.listener.listen();
    }

    private async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { title, price } = data;
        const ticket = await Ticket.findById(data.id);
        if (!ticket) {
            throw new Error("Ticket Not Found");
        }
        ticket.set({
            title, price
        });
        await ticket.save();
        msg.ack();
    }
}