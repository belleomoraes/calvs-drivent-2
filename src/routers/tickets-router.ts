import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketsTypes, getTickets } from "@/controllers";
const ticketsRouter = Router();

ticketsRouter.all("/*", authenticateToken).get("/types", getTicketsTypes).get("/", getTickets);
// .post("/");

export { ticketsRouter };
