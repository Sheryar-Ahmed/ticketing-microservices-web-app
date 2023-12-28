import express from "express";
import { createOrder, deleteOrder, getALLOrders, getOrderByID } from "../controller/order";
import { isAuthenticated } from "@satickserv/common";

const router = express.Router();


router.get('/api/orders', isAuthenticated, getALLOrders);
router.get('/api/orders/getone/:orderId', isAuthenticated, getOrderByID);
router.post('/api/oders/new', isAuthenticated, createOrder);
router.delete('/api/orders/del/:orderId', isAuthenticated, deleteOrder);


export { router as OrderRouter };