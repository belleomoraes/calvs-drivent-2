import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }

    if (error.name === "ForbiddenError") {
      return res.send(httpStatus.FORBIDDEN);
    }
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  if (roomId === undefined || roomId < 1) {
    return res.send(httpStatus.BAD_REQUEST);
  }

  try {
    const bookingId = await bookingService.createBooking(userId, roomId);

    return res.status(httpStatus.OK).send(bookingId);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }

    if (error.name === "ForbiddenError") {
      return res.send(httpStatus.FORBIDDEN);
    }
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;

  if (roomId === undefined || !bookingId || roomId < 1 || Number(bookingId) < 1) {
    return res.send(httpStatus.BAD_REQUEST);
  }

  try {
    const bookingIdReturn = await bookingService.changeBooking(userId, roomId, bookingId);

    return res.status(httpStatus.OK).send(bookingIdReturn);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }

    if (error.name === "ForbiddenError") {
      return res.send(httpStatus.FORBIDDEN);
    }
  }
}
