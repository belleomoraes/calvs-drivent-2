import hotelsRepository from "@/repositories/hotels-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError, paymentError } from "@/errors";
import { TicketStatus } from "@prisma/client";

async function getHotels(userId: number) {
  const enrollmentId = await getEnrollmentId(userId);
  await checkTicket(enrollmentId);

  return hotelsRepository.findHotels();
}

async function getHotelById(hotelId: string, userId: number) {
  const enrollmentId = await getEnrollmentId(userId);
  await checkTicket(enrollmentId);

  const hotelWithRooms = await hotelsRepository.findHotelFromId(hotelId);

  if (!hotelWithRooms) {
    throw notFoundError();
  }

  return hotelWithRooms;
}

async function getEnrollmentId(userId: number) {
  const enrollment = await ticketsRepository.findEnrollmentId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  return enrollment.id;
}

async function checkTicket(enrollmentId: number) {
  const tickets = await ticketsRepository.findTickets(enrollmentId);

  if (!tickets || !tickets.TicketType.includesHotel) {
    throw notFoundError();
  }

  if (tickets.status === "RESERVED") {
    throw paymentError();
  }

  return;
}

const hotelsService = {
  getHotels,
  getHotelById,
};

export default hotelsService;
