import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId } = req.query as TicketId;
  if (!ticketId) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const payments = await paymentsService.getPayments(ticketId, userId);

    return res.status(httpStatus.OK).send(payments);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }

    if (error.name === "UnauthorizedError") {
      return res.send(httpStatus.UNAUTHORIZED);
    }
  }
}

export async function insertPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId, cardData } = req.body;

  if (!ticketId || !cardData) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
  try {
    const payment = await paymentsService.insertPayment(ticketId, cardData, userId);
    if (payment === "") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (payment === "ticket não existe") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else {
      return res.status(httpStatus.OK).send(payment);
    }
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

type TicketId = {
  ticketId: string;
};
