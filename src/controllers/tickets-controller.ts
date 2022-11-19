import { notFoundError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Response, Request } from "express";
import httpStatus from "http-status";

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsTypes = await ticketsService.getTicketsTypes();

    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const tickets = await ticketsService.getTickets(userId);

    if (tickets === "" || tickets.length === 0) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else {
      return res.status(httpStatus.OK).send(tickets);
    }
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function insertTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  if (!ticketTypeId) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
  try {
    const tickets = await ticketsService.insertTicket(userId, ticketTypeId);

    if (tickets === "") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else {
      return res.status(httpStatus.CREATED).send(tickets);
    }
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
