import express from "express";
import { createCharge } from "../controller/payment";
import { isAuthenticated } from "@satickserv/common";

const router = express.Router();


router.post('/api/payments', isAuthenticated, createCharge);


export { router as chargeRouter };