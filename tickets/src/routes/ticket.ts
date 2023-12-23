import express from 'express';
import { CreateTicket, ListAllTickets, UpdateTicket, getTicketById } from '../controller/ticket';
import { isAuthenticated } from '@satickserv/common';


const router = express.Router();

router.post('/api/ticket/new', isAuthenticated, CreateTicket);
router.get('/api/ticket/getAll', ListAllTickets);
router.get('/api/ticket/getone/:id', isAuthenticated, getTicketById);
router.put('/api/ticket/update/:id', isAuthenticated, UpdateTicket);


export { router as TicketRouter };