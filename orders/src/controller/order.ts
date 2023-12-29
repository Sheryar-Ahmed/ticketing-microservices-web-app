import { Request, Response } from "express";
import { Order, OrderStatus } from "../model/order";
import { Ticket } from "../model/ticket";
import { OrderCreatedTPublisher } from "../events/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/order-cancelled-publisher";

//Time to expire a ticket
const WINDOW_USER_TICKET_EXPIRATION = 1 * 60;

const getALLOrders = async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');
    return res.status(200).json({
        success: true,
        orders
    })
}


const createOrder = async (req: Request, res: Response) => {
    if (!req.params.orderId) {
        return res.status(401).json({
            success: false,
            message: "Ticket is required to go",
        });
    }
    //Find the ticket the user is trying to reserve
    const ticket = await Ticket.findById(req.params.orderId);
    if (!ticket) {
        return res.status(404).json({
            success: false,
            message: "Ticket not found.",
        });
    }
    //Make sure that ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
        return res.status(401).json({
            success: false,
            message: "Ticket is reserved",
        });
    }

    //calculate the expiration time
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + WINDOW_USER_TICKET_EXPIRATION);

    //build a order for the ticket
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });

    await order.save();
    //publish an event for it.
    await new OrderCreatedTPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        version: +(order.version),
        expiresAt: order.expiresAt.toISOString(),
        userId: req.currentUser!.id,
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    });
    return res.status(200).json({
        success: true,
        order
    })
}

const getOrderByID = async (req: Request, res: Response) => {

    const { orderId } = req.params;
    if (!orderId) {
        return res.status(401).json({
            success: false,
            message: "Order ID cannot be empty",
        });
    }

    const existingOrder = await Order.findById(req.params.orderId).populate('ticket');

    if (!existingOrder) {
        return res.status(404).json({
            success: false,
            message: "No order found"
        })
    }

    if (req.currentUser!.id != existingOrder.userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access"
        })
    }

    return res.status(200).json({
        success: true,
        existingOrder
    })
}


const deleteOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    if (!orderId) {
        return res.status(401).json({
            success: false,
            message: "Order ID cannot be empty",
        });
    }

    const deleteOrderExists = await Order.findById(req.params.orderId).populate('ticket');

    if (!deleteOrderExists) {
        return res.status(400).json({
            success: false,
            message: "No Order FOund"
        })
    }

    if (req.currentUser!.id != deleteOrderExists.userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access"
        })
    }

    deleteOrderExists.status = OrderStatus.Cancelled;

    await deleteOrderExists.save();

    //publish an event
    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: deleteOrderExists.id,
        version: +deleteOrderExists.version,
        ticket: {
            id: deleteOrderExists.ticket.id
        }
    });
    return res.status(200).json({
        success: true,
        cancelledOrder: deleteOrderExists
    })
}



export { getALLOrders, createOrder, getOrderByID, deleteOrder };