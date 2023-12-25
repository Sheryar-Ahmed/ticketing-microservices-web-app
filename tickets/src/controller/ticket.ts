import { Request, Response } from "express";
import { Ticket } from "../model/ticket";
import { TicketCreatedPublisher } from '../events/ticket-created-publisher';
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/ticket-updated-publisher";

const ListAllTickets = async (req: Request, res: Response) => {
    const alltickets = await Ticket.find({});

    return res.status(200).json({
        success: true,
        alltickets
    })
};

//create a new ticket
const CreateTicket = async (req: Request, res: Response) => {
    const { title, price } = req.body;

    if (!title || !price) {
        return res.status(401).json({
            success: false,
            message: "Invalid Information"
        })
    };

    const newTicket = await Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    if (!newTicket) {
        return res.status(401).json({
            success: false,
            message: "Something bad happend during creation of ticket.Try again",
        })
    }
    newTicket.save();

    const ticketCreatedPublisher = new TicketCreatedPublisher(natsWrapper.client);
    // Example data
    const eventData = {
        id: newTicket.id,
        version: 1,
        title: newTicket.title,
        price: newTicket.price,
        userId: newTicket.userId,
    };

    // Publish the event
    ticketCreatedPublisher.publish(eventData)
        .then(() => console.log('Event published successfully'))
        .catch(error => console.error('Error publishing event:', error));

    return res.status(201).json({
        success: true,
        newTicket
    });

};

//retrieve a ticket
const getTicketById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(401).json({
            success: false,
            message: "Id cannot be NULL"
        })
    };

    const found = await Ticket.findById({ _id: id });

    if (found) {
        if (found.userId != req.currentUser!.id) {
            return res.status(401).json({
                success: false,
                message: "There is no Ticket Associated with you.",
            })
        }
    };

    if (!found) {
        return res.status(401).json({
            success: false,
            message: "No Ticket Found with this ID.",
        })
    }

    return res.status(201).json({
        success: true,
        ticket: found
    });

};

//Update a ticket
const UpdateTicket = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: "Id cannot be NULL"
        })
    };

    const foundTicket = await Ticket.findById({ _id: id });

    if (foundTicket) {
        if (foundTicket.userId != req.currentUser!.id) {
            return res.status(401).json({
                success: false,
                message: "There is no Ticket Associated with you.",
            })
        }
    };

    // const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, updateData);
    foundTicket?.set(updateData);
    foundTicket?.save();
    //even
    const ticketUpdatedPublisher = new TicketUpdatedPublisher(natsWrapper.client);
    // Example data
    const eventData = {
        id: foundTicket!.id,
        version: foundTicket!.__v,
        title: foundTicket!.title,
        price: foundTicket!.price,
        userId: foundTicket!.userId,
    };

    // Publish the event
    await ticketUpdatedPublisher.publish(eventData)
        .then(() => console.log('Ticket Updated Event published successfully'))
        .catch(error => console.error('Ticket Updated Event Error publishing event:', error));

    return res.status(201).json({
        success: true,
        foundTicket
    });

};

export { ListAllTickets, CreateTicket, getTicketById, UpdateTicket };