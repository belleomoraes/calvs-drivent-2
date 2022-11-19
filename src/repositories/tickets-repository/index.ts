import { prisma } from "@/config";

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

const ticketsRepository = {
  findTypes,
  findTickets,
};

export default ticketsRepository;
