import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

export async function updateBooking(userId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: userId,
    },
    data: {
      roomId: roomId,
    },
  });
}
