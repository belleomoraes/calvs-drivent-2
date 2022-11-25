import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import {
  createHotel,
  createRoom,
  createBooking,
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
} from "../factories";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  //responder com 401 se não tiver autorização,
  it("Should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  //responder com 200 caso dê tudo certo, should respond with status 200 and with hotels data
  describe("When token is valid", () => {
    //responder com 404 se não tiver ticket pago com hospedagem
    it("Should respond with 404 when user doesnt have enrollment", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with 404 when user doesnt have ticket", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with 404 when ticket does not include hotel", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with 404 when ticket has not been paid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    //responder 200 se der tudo certo
    it("Should respond with status 200 and hotel data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  //responder com 401 se não tiver autorização,
  it("Should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with 400 when no hotelId was given", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    //responder com 404 se o hotelId não existir
    it("Should respond with 404 when given hotelId does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    //responder com 404 se o hotelId não pertence ao user PAREI AQUI
    it("Should respond with 404 when user doesnt own given hotelId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const otherUser = await createUser();

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    //se passar query, responder com 200 caso dê tudo certo, should respond with status 200 and with rooms com hotel data
    it("Should respond with status 200 and room/hotel data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const rooms = await createRoom();
      const booking = await createBooking();

      const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: rooms.id,
          name: rooms.name,
          capacity: rooms.capacity,
          hotelId: rooms.hotelId,
          Hotel: {
            id: rooms.Hotel.id,
            name: rooms.Hotel.name,
            image: rooms.Hotel.image,
            createdAt: rooms.Hotel.createdAt,
            updatedAt: rooms.Hotel.updatedAt,
          },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });
});
