import { Message, Stan } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus, Subjects, createListener } from '@satickserv/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener {
    private listener;
    private client: Stan;

    constructor(client: Stan) {
        this.client = client;
        this.listener = createListener<OrderCancelledEvent>(
            client,
            Subjects.OrderCancelled,
            queueGroupName,
            this.onMessage.bind(this)
        );
    }

    listen(): void {
        this.listener.listen();
    }

    private async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({ _id: data.id, version: data.version-1 });
        if (!order) {
            throw new Error("Order Not found during Cancellation in Payment Service");
        }

        order.set({
            status: OrderStatus.Cancelled
        })

        await order.save();

        msg.ack();
    }
}