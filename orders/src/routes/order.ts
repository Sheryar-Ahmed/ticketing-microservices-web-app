import express from "express";
import { createOrder, deleteOrder, getALLOrders, getOrderByID } from "../controller/order";

const router = express.Router();


router.get('/api/orders', getALLOrders);
router.get('/api/orders/getone/:orderId', getOrderByID);
router.post('/api/oders/new', createOrder);
router.delete('/api/orders/del/:orderId', deleteOrder);


export { router as OrderRouter};