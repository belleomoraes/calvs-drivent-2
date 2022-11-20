import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { insertPayment, getPayments } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken).get("/", getPayments).post("/process", insertPayment);

export { paymentsRouter };
