import { prisma } from "@/config";

async function findHotels() {
  return await prisma.hotel.findMany();
}

async function findHotelFromId(hotelId: string) {
  return await prisma.hotel.findFirst({
    where: {
      id: Number(hotelId),
    },
    include: {
      Rooms: true
    },
  });
}

const hotelsRepository = {
  findHotels,
  findHotelFromId,
};

export default hotelsRepository;
