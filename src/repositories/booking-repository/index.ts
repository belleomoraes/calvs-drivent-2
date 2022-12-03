import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBooking(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    include: {
      Room: true,
    },
  });
}

async function findBookingById(bookingId: string) {
  return await prisma.booking.findFirst({
    where: {
      id: Number(bookingId),
    },
    include: {
      Room: true,
    },
  });
}

async function insertBooking(bookingDataToCreate: BookingBody) {
  return await prisma.booking.create({
    data: bookingDataToCreate,
  });
}

async function getRoom(roomId: number) {
  return await prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

async function updateBooking(roomId: number, bookingId: string): Promise<Booking> {
  return await prisma.booking.update({
    where: {
      id: Number(bookingId),
    },
    data: {
      roomId: roomId,
    },
  });
}
const bookingRepository = {
  findBooking,
  findBookingById,
  insertBooking,
  getRoom,
  updateBooking,
};

export default bookingRepository;

type BookingBody = Pick<Booking, "roomId" | "userId">;
