import { Message, Stan } from 'node-nats-streaming';
import { Subjects, PaymentCreatedEvent, createListener, OrderStatus } from '@satickserv/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../model/order';

export class PaymentCreatedEventListener {
    private listener;
    constructor(client: Stan) {
        this.listener = createListener<PaymentCreatedEvent>(
            client,
            Subjects.PaymentCreated,
            queueGroupName,
            this.onMessage.bind(this)
        );
    }

    listen(): void {
        this.listener.listen();
    }

    private async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error("Order Not found during payment created event listener");
        }

        order.set({
            status: OrderStatus.Complete,
        })

        await order.save();
        msg.ack();
    }
}