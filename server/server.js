import express from "express";
import { connect } from "./config/db.js"
import { authRouter } from "./routes/auth.route.js";
import { auctionRouter } from "./routes/auction.route.js";
import { bidRouter } from "./routes/bid.route.js";
import { startAuctionStatusCron } from "./cron/auctionStatus.cron.js";
import { initSocket } from "./socket/index.js";
import { Server } from "socket.io";
import http from "http";
import env from "dotenv";
import cors from "cors";
import { paymentRouter } from "./routes/payment.route.js";
import { recommendRouter } from "./routes/recommendation.routes.js";
import { AIrouter } from "./routes/ai.route.js";


env.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            process.env.CLIENT_URL,
            "http://localhost:5173"
        ],
        credentials: true
    }
});

app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        "http://localhost:5173"
    ],
    credentials: true
}));

initSocket(io);

app.use(express.json());

connect();
startAuctionStatusCron();


app.use("/api", authRouter);
app.use("/api", auctionRouter);
app.use("/api", bidRouter);
app.use("/api", paymentRouter);
app.use("/api", recommendRouter);
app.use("/api", AIrouter)
app.get("/", (req, res) => {
    res.send("Server running !!!");
});

app.head("/", (req, res) => {
    res.sendStatus(200);
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export { io };
