import { Message, Stan } from 'node-nats-streaming';
import { Subjects, ExpirationCompleteEvent, createListener, OrderStatus } from '@satickserv/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../model/order';
import { OrderCancelledPublisher } from '../order-cancelled-publisher';

export class ExpirationCompletionListener {
    private listener;
    private client: Stan;
    constructor(client: Stan) {
        this.client = client;
        this.listener = createListener<ExpirationCompleteEvent>(
            client,
            Subjects.ExpirationComplete,
            queueGroupName,
            this.onMessage.bind(this)
        );
    }

    listen(): void {
        this.listener.listen();
    }

    private async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');
        if (!order) {
            throw new Error("Order Not found during expiration event listener");
        }
        //gonna check if the orderstatus is already payed then we are not gonna change it
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cancelled,
        })

        await order.save();

        //need to publish the orderCancelled event to Payments service
        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: +order.version,
            ticket: {
                id: order.ticket.id,
            }
        });
        msg.ack();
    }
}