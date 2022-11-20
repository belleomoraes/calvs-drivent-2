import paymentsRepository from "@/repositories/payments-repository";
import { notFoundError, unauthorizedError } from "@/errors";

async function getPayments(ticketId: string, userId: number) {
  const isTicketExists = await paymentsRepository.findTicketId(ticketId);

  if (!isTicketExists) {
    throw notFoundError();
  }

  const enrollmentIdFromUserId = await paymentsRepository.findTicketOwnership(userId);

  const isTicketIdFromUser = enrollmentIdFromUserId.Ticket.filter((v) => {
    if (v.id === Number(ticketId)) return v;
  });

  if (!isTicketIdFromUser[0]) {
    throw unauthorizedError();
  }

  const payments = await paymentsRepository.findPayments(ticketId);
  if (!payments) {
    throw notFoundError();
  }
  return payments;
}

async function insertPayment(ticketId: string, cardData: string[], userId: number) {
  const result = await paymentsRepository.createPayment(ticketId, cardData, userId);
  if (!result) {
    return "";
  } else if (result === "ticket não existe") {
    return "ticket não existe";
  } else {
    return result;
  }
}

const paymentsService = {
  getPayments,
  insertPayment,
};

export default paymentsService;
