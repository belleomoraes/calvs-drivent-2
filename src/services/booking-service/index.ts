import bookingRepository from "@/repositories/booking-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError, forbiddenError } from "@/errors";
import { Booking } from "@prisma/client";

async function getBooking(userId: number) {
  const enrollmentId = await getEnrollmentId(userId);

  await checkTicket(enrollmentId);

  const booking = await bookingRepository.findBooking(userId);

  if (!booking) {
    throw notFoundError();
  }

  return {
    id: booking.id,
    Room: booking.Room,
  };
}

async function createBooking(userId: number, roomId: number) {
  const enrollmentId = await getEnrollmentId(userId);
  await checkTicket(enrollmentId);
  const room = await bookingRepository.getRoom(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.Booking.length >= room.capacity) {
    throw forbiddenError();
  }

  const isBookingExists = await bookingRepository.findBooking(userId);
  if (isBookingExists) {
    throw forbiddenError();
  }

  const bookingDataToCreate = { userId, roomId };

  const booking: Booking = await bookingRepository.insertBooking(bookingDataToCreate);

  return { id: booking.id };
}

async function changeBooking(userId: number, roomId: number, bookingId: string) {
  const enrollmentId = await getEnrollmentId(userId);
  await checkTicket(enrollmentId);
  const room = await bookingRepository.getRoom(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.Booking.length >= room.capacity) {
    throw forbiddenError();
  }

  const isBookingExists = await bookingRepository.findBookingById(bookingId);
  if (!isBookingExists || isBookingExists.userId !== userId) {
    throw forbiddenError();
  }

  const booking: Booking = await bookingRepository.updateBooking(roomId, bookingId);

  return { id: booking.id };
}

async function getEnrollmentId(userId: number) {
  const enrollment = await ticketsRepository.findEnrollmentId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }
  return enrollment.id;
}
async function checkTicket(enrollmentId: number) {
  const tickets = await ticketsRepository.findTickets(enrollmentId);

  if (!tickets || !tickets.TicketType.includesHotel || tickets.status === "RESERVED") {
    throw forbiddenError();
  }

  return tickets;
}

const bookingService = {
  getBooking,
  createBooking,
  changeBooking,
};

export default bookingService;
