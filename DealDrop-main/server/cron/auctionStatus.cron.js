import cron from "node-cron";
import { Auction } from "../models/auction.js";

function startAuctionStatusCron() {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();

            await Auction.updateMany(
                {
                    status: "UPCOMING",
                    startTime: { $lte: now },
                    isBlocked: false
                },
                {
                    $set: { status: "LIVE" }
                }
            );

            const endingAuctions = await Auction.find(
                {
                    status: "LIVE",
                    endTime: { $lte: now },
                    isBlocked: false
                }
            );

            for (const auction of endingAuctions) {
                let winner = null;

                if (auction.bidCount > 0) {
                    winner = auction.highestBidder;
                }

                await Auction.findByIdAndUpdate(auction._id, {
                    status: "ENDED",
                    winnerId: winner
                });

            }

        } catch (e) {
            console.error("Auction cron error : ", e.message);
        }
    })
}

export { startAuctionStatusCron };