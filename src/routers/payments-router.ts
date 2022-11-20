import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import {  createPaymentSchema } from "@/schemas";
import { insertPayment, getPayments } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken).get("/", getPayments).post("/process", validateBody(createPaymentSchema), insertPayment);

export { paymentsRouter };
