import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(userId);
    console.log("🚀 passa aqui por favor meu jesus ~ file: booking-controller.ts:10 ~ getBooking ~ booking", booking);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }

    if (error.name === "PaymentError") {
      return res.send(httpStatus.PAYMENT_REQUIRED);
    }
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId: number = req.body;

  try {
    const bookingId = await bookingService.createBooking(userId, roomId);

    return res.status(httpStatus.OK).send(bookingId);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }

    if (error.name === "PaymentError") {
      return res.send(httpStatus.PAYMENT_REQUIRED);
    }

    if (error.name === "ForbiddenError") {
      return res.send(httpStatus.FORBIDDEN);
    }
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId: number = req.body;
  try {
    const bookingId = await bookingService.changeBooking(userId, roomId);

    return res.status(httpStatus.OK).send(bookingId);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }

    if (error.name === "PaymentError") {
      return res.send(httpStatus.PAYMENT_REQUIRED);
    }

    if (error.name === "ForbiddenError") {
      return res.send(httpStatus.FORBIDDEN);
    }
  }
}
