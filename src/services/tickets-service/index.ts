import ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError } from "@/errors";
import { Ticket, TicketStatus } from "@prisma/client";

async function getTicketsTypes() {
  const result = ticketsRepository.findTypes();

  return result;
}

async function getTickets(userId: number) {
  const enrollmentId = await getEnrollmentId(userId);
  const tickets = await ticketsRepository.findTickets(enrollmentId);

  if (!tickets) {
    throw notFoundError();
  }
  return tickets;
}

async function insertTicket(userId: number, ticketTypeId: number) {
  const enrollmentId = await getEnrollmentId(userId);

  const ticketType = await ticketsRepository.findTicketTypeId(ticketTypeId);

  if (!ticketType) {
    throw notFoundError();
  }

  const ticket: TicketRequest = {
    ticketTypeId: Number(ticketTypeId),
    enrollmentId: Number(enrollmentId),
    status: TicketStatus.RESERVED,
  };

  const tickets = await ticketsRepository.createTicket(ticket, enrollmentId);
  if (!tickets) {
    throw notFoundError();
  }
  return tickets;
}

async function getEnrollmentId(userId: number) {
  const enrollment = await ticketsRepository.findEnrollmentId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  return enrollment.id;
}

const ticketsService = {
  getTicketsTypes,
  getTickets,
  insertTicket,
};

export default ticketsService;

type TicketRequest = Omit<Ticket, "id" | "createdAt" | "updatedAt">;
