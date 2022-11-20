import { prisma } from "@/config";
import { Payment } from "@prisma/client";
import { TicketStatus } from "@prisma/client";

async function findPayments(ticketId: string) {
  return prisma.payment.findFirst({
    where: {
      ticketId: Number(ticketId),
    },
  });
}

async function findTicketId(ticketId: string) {
  return await prisma.ticket.findFirst({
    where: {
      id: Number(ticketId),
    },
  });
}

async function findTicketOwnership(userId: number) {
  return await prisma.enrollment.findFirst({
    where: {
      userId: userId,
    },
    include: {
      Ticket: true,
    },
  });
}

async function findTicketValue(ticketTypeId: number) {
  return await prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId,
    },
    select: {
      price: true,
    },
  });
}

async function createPaymentUpdateTicket(payment: PaymentToCreate) {
  const result = await prisma.payment.create({
    data: payment,
  });

  await prisma.ticket.update({
    where: {
      id: payment.ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });

  return result;
}

const paymentsRepository = {
  findPayments,
  createPaymentUpdateTicket,
  findTicketId,
  findTicketOwnership,
  findTicketValue,
};

export type PaymentToCreate = Omit<Payment, "id" | "createdAt" | "updatedAt">;
export type CardData = {
  issuer: string;
  number: string;
  name: string;
  expirationDate: string;
  cvv: string;
};
export type PaymentBody = {
  ticketId: string;
  cardData: CardData;
};

export default paymentsRepository;
