import { prisma } from "@/config";
import { Payment } from "@prisma/client";

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

async function createPayment(ticketId: string, cardData: string[], userId: number) {
  const isTicketExists = await prisma.ticket.findUnique({
    where: {
      id: Number(ticketId),
    },
  });

  if (!isTicketExists) {
    return "ticket não existe";
  }

  const enrollmentIdFromUserId = await prisma.enrollment.findUnique({
    where: {
      userId: userId,
    },
    include: {
      Ticket: true,
    },
  });

  const isTicketIdFromUser = enrollmentIdFromUserId.Ticket.filter((v) => {
    if (v.id === userId) return v;
  });

  if (!isTicketIdFromUser) {
    return "";
  }

  const paymentObj: Payment = {
    ticketId: Number(ticketId),
    value: 1,
    cardIssuer: "2",
    cardLastDigits: "3",
  };
  return prisma.payment.create({
    data: paymentObj,
  });
}

const paymentsRepository = {
  findPayments,
  createPayment,
  findTicketId,
  findTicketOwnership,
};

export default paymentsRepository;
