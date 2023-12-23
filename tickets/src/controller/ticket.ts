import { Request, Response } from "express";
import { Ticket } from "../model/ticket";


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
    newTicket.save();
    if (!newTicket) {
        return res.status(401).json({
            success: false,
            message: "Something bad happend during creation of ticket.Try again",
        })
    }

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

    return res.status(201).json({
        success: true,
        foundTicket
    });

};

export { ListAllTickets, CreateTicket, getTicketById, UpdateTicket };