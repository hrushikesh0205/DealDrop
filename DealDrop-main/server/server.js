import express from "express";
import {connect} from "./config/db.js"
import { authRouter } from "./routes/auth.route.js";
import { auctionRouter } from "./routes/auction.route.js";
import { bidRouter } from "./routes/bid.route.js";
import { startAuctionStatusCron } from "./cron/auctionStatus.cron.js";
import { initSocket } from "./socket/index.js";
import {Server} from "socket.io";
import http from "http";
import env from "dotenv";
import cors from "cors";


env.config();

const app = express();
const server = http.createServer(app);
const io=new Server(server,{
    cors:{
        origin : "*"
    }
});

initSocket(io);

app.use(cors());
app.use(express.json());

connect();
startAuctionStatusCron();


app.use("/api",authRouter);
app.use("/api",auctionRouter);
app.use("/api",bidRouter);
app.get("/",(req,res)=>
{
    res.send("Server running !!!");
});

const port=process.env.PORT || 5000;
server.listen(port,()=>
{
    console.log(`Server is running on http://localhost:${port}`);
});

export {io};
