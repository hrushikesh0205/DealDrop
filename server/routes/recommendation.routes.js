import { recommendPrice } from "../controllers/recommendation.controller.js";
import express from "express"

const recommendRouter = express.Router();

recommendRouter.get("/recommend-price",recommendPrice);

export {recommendRouter}