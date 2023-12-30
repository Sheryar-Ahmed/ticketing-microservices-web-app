import { Request, Response } from "express"
import { Order, OrderStatus } from "../models/order";
import { stripe } from "../stripe";


const createCharge = async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    if (!token || !orderId) {
        return res.status(400).json({
            success: false,
            message: "Token or orderId cannot be empty",
        })
    }
    //pull out the order from the database
    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(400).json({
            message: "Order not found during payment charge",
        })
    }
    //authorization
    if (order.userId != req.currentUser!.id) {
        return res.status(401).json({ message: "Unauthorized Access" });
    }
    //need to check that the order is not cancelled, if cancelled, we cannot make a payment
    if (order.status == OrderStatus.Cancelled) {
        return res.status(400).json({ message: "Cannot Pay for a Cancelled Order." });
    }
    //we are gonna charge for the ticket
    await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100, //accepts in cents
        source: token,
        description: `Payment Done for the Ticket price ${order.price}`

    });

    res.status(201).json({
        success: true,
    })
}


export { createCharge };