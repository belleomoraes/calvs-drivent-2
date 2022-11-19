import { prisma } from "@/config";
import { Ticket, TicketStatus } from "@prisma/client";

async function findTypes() {
  return prisma.ticketType.findMany();
}

async function findTickets(userId: number) {
  let tickets;
  const enrollmentIdFromUserId = await prisma.enrollment.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!enrollmentIdFromUserId) {
    tickets = null;
    return tickets;
  }

  tickets = await prisma.ticket.findMany({
    where: {
      enrollmentId: enrollmentIdFromUserId.id,
    },
    include: {
      TicketType: true,
    },
  });

  const result = tickets.map((v) => {
    return {
      id: v.id,
      status: v.status,
      ticketTypeId: v.ticketTypeId,
      enrollmentId: v.enrollmentId,
      TicketType: v.TicketType,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    };
  });

  return result;
}

async function createTicket(userId: number, ticketTypeId: number) {
  let tickets;
  const ticketTypeExists = await prisma.ticketType.findMany({
    where: {
      id: Number(ticketTypeId),
    },
  });

  const enrollmentIdFromUserId = await prisma.enrollment.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!ticketTypeExists || !enrollmentIdFromUserId) {
    tickets = null;
    return tickets;
  }

  const ticket: Ticket = {
    ticketTypeId: Number(ticketTypeId),
    enrollmentId: enrollmentIdFromUserId.id,
    status: TicketStatus.RESERVED,
  };

  await prisma.ticket.create({
    data: ticket,
  });

  tickets = await prisma.ticket.findMany({
    where: {
      enrollmentId: enrollmentIdFromUserId.id,
    },
    include: {
      TicketType: true,
    },
  });

  const result = tickets.map((v) => {
    return {
      id: v.id,
      status: v.status,
      ticketTypeId: v.ticketTypeId,
      enrollmentId: v.enrollmentId,
      TicketType: v.TicketType,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    };
  });

  return result;
}

const ticketsRepository = {
  findTypes,
  findTickets,
  createTicket,
};

export default ticketsRepository;
