import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.name.findName(),
    },
  });
}

export async function createRoom() {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: expect.any(Number),
      hotelId: faker.datatype.number({ min: 100, max: 999 })
    }, include: {
      Hotel: true,
    },
  });
}

export async function createBooking() {
  return prisma.booking.create({
    data: {
      userId: faker.datatype.number({ min: 100, max: 999 }),
      roomId: faker.datatype.number({ min: 100, max: 999 })
    },
  });
}
