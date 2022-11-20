import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getTicketsTypes, getTickets, insertTicket } from "@/controllers";
import { createTicketTypeSchema } from "@/schemas";
const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketsTypes)
  .get("/", getTickets)
  .post("/", validateBody(createTicketTypeSchema), insertTicket);

export { ticketsRouter };
