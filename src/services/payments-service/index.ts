import paymentsRepository from "@/repositories/payments-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import { Payment } from "@prisma/client";

async function getPayments(ticketId: string, userId: number) {
  await checkTicketExistance(ticketId);
  await checkIfTicketIsFromUser(ticketId, userId);

  const payments = await paymentsRepository.findPayments(ticketId);
  if (!payments) {
    throw notFoundError();
  }
  return payments;
}

async function insertPayment(ticketId: string, cardData: CardData, userId: number) {
  const ticket = await checkTicketExistance(ticketId);
  await checkIfTicketIsFromUser(ticketId, userId);

  const ticketTypeId = ticket.ticketTypeId;

  const ticketValue = await getTicketValue(ticketTypeId);

  const cardLastDigits = getCardLastDigits(cardData);
  const payment: PaymentToCreate = {
    ticketId: Number(ticketId),
    value: ticketValue,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardLastDigits,
  };

  const payments = await paymentsRepository.createPaymentUpdateTicket(payment);
  if (!payments) {
    throw notFoundError();
  }
  return payments;
}

function getCardLastDigits(cardData: CardData) {
  return cardData.number.slice(-4);
}

async function getTicketValue(ticketTypeId: number) {
  const ticket = await paymentsRepository.findTicketValue(ticketTypeId);

  return ticket.price;
}

async function checkTicketExistance(ticketId: string) {
  const isTicketExists = await paymentsRepository.findTicketId(ticketId);

  if (!isTicketExists) {
    throw notFoundError();
  }

  return isTicketExists;
}

async function checkIfTicketIsFromUser(ticketId: string, userId: number) {
  const enrollmentIdFromUserId = await paymentsRepository.findTicketOwnership(userId);

  const isTicketIdFromUser = enrollmentIdFromUserId.Ticket.filter((v) => {
    if (v.id === Number(ticketId)) return v;
  });

  if (!isTicketIdFromUser[0]) {
    throw unauthorizedError();
  }

  return;
}
const paymentsService = {
  getPayments,
  insertPayment,
};

type PaymentToCreate = Omit<Payment, "id" | "createdAt" | "updatedAt">;
type CardData = {
  issuer: string;
  number: string;
  name: string;
  expirationDate: string;
  cvv: string;
};

export default paymentsService;
