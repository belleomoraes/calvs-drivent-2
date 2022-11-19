import ticketsRepository from "@/repositories/tickets-repository";
import { TicketStatus, Ticket } from "@prisma/client";
import { notFoundError, requestError } from "@/errors";
async function getTicketsTypes() {
  const result = ticketsRepository.findTypes();

  return result;
}

async function getTickets(userId: number) {
  const result = await ticketsRepository.findTickets(userId);

  if (!result) {
    return "";
  } else {
    return result;
  }
}

const ticketsService = {
  getTicketsTypes,
  getTickets,
};

export default ticketsService;
