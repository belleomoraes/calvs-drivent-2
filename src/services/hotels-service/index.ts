import hotelsRepository from "@/repositories/hotels-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError, paymentError } from "@/errors";

async function getHotels(userId: number) {
  const enrollmentId = await getEnrollmentId(userId);

  const ticket = await checkTicket(enrollmentId);

  return await hotelsRepository.findHotels();
}

async function getRoomByHotelId(hotelId: string, userId: number) {
  const enrollmentId = await getEnrollmentId(userId);
  const ticket = await checkTicket(enrollmentId);

  const hotelWithRooms = await hotelsRepository.findRoomByHotelId(hotelId);

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
}

const hotelsService = {
  getHotels,
  getRoomByHotelId,
};

export default hotelsService;
