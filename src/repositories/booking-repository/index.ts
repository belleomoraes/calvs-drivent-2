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
  });
}

async function updateBooking(userId: number, roomId: number): Promise<Booking> {
  return await prisma.booking.update({
    where: {
      id: 1,
    },
    data: {
      roomId: roomId,
    },
  });
}
const bookingRepository = {
  findBooking,
  insertBooking,
  getRoom,
  updateBooking,
};

export default bookingRepository;

type BookingBody = Pick<Booking, "roomId" | "userId">;
