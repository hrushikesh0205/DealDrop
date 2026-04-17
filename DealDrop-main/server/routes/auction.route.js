import express from "express";
import { createAuction,getAllAuctions, getAuctionById, getMyAuctions } from "../controllers/auction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.js";

const auctionRouter = express.Router();

auctionRouter.post("/createAuction",authMiddleware,roleMiddleware(["seller"]),upload.single("image"),createAuction);
auctionRouter.get("/auctions", getAllAuctions);
auctionRouter.get("/auction/:id", getAuctionById);
auctionRouter.get("/my-auctions", authMiddleware, getMyAuctions);



export { auctionRouter };