import { getBidHistory, getMyBids } from "../controllers/bid.controller.js";
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const bidRouter = express.Router();

bidRouter.get("/auction/:auctionId/bids",getBidHistory);
bidRouter.get("/my-bids", authMiddleware, getMyBids);


export {bidRouter};