import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

async function findTypes() {
  return prisma.ticketType.findMany();
}

async function findTickets(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findEnrollmentId(userId: number) {
  return await prisma.enrollment.findFirst({
    where: {
      userId: userId,
    },
  });
}

async function findTicketTypeId(ticketTypeId: number) {
  return await prisma.ticketType.findMany({
    where: {
      id: Number(ticketTypeId),
    },
  });
}
async function createTicket(ticket: TicketRequest, enrollmentId: number) {
  await prisma.ticket.create({
    data: ticket,
  });

  const result = await prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });

  return result;
}
type TicketRequest = Omit<Ticket, "id" | "createdAt" | "updatedAt">;
const ticketsRepository = {
  findTypes,
  findTickets,
  createTicket,
  findEnrollmentId,
  findTicketTypeId,
};

export default ticketsRepository;
