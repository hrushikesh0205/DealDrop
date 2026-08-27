import { createOrder,verifyPayment } from "../controllers/payment.controller.js";
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", authMiddleware, createOrder);
paymentRouter.post("/verify-payment", authMiddleware, verifyPayment);

export {paymentRouter};