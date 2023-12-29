import { Message, Stan } from 'node-nats-streaming';
import { OrderCreatedEvent, Subjects, createListener } from '@satickserv/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

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
       const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        });

        await order.save();
        msg.ack();
    }
}