import express from "express";
import { generateDescription } from "../controllers/ai.controller.js";

const AIrouter = express.Router();

AIrouter.post("/generate-description", generateDescription);

export {AIrouter};