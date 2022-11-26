import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getRoomByHotelId } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter.all("/*", authenticateToken).get("/", getHotels).get("/:hotelId", getRoomByHotelId);

export { hotelsRouter };
