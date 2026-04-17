// import {io} from "../server.js";
import { socketAuth } from "./socketAuth.js";
import { Auction } from "../models/auction.js";
import { Bid } from "../models/bid.js";

const FIRST_BID_MAX_INCREMENT = 100;
const NEXT_BID_MIN_INCREMENT = 100;
const NEXT_BID_MAX_INCREMENT = 200;
const BID_DIVISIBILITY = 5;
function initSocket(io) {
    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log("User Connected : ", socket.user.userId);

        socket.on("join-auction", (auctionId) => {
            socket.join(auctionId);
            console.log(`User joined auction ${auctionId}`);
        });

        socket.on("place-bid", async ({ auctionId, bidAmount }) => {
            try {
                const userId = socket.user.userId;
                const role = socket.user.role;
                // const MIN_BID_INCREMENT = 100;

                if (!["bidder", "seller"].includes(role)) {
                    return socket.emit("bid-error", "You are not allowed to place bids");
                }

                const auction = await Auction.findById(auctionId);
                if (!auction) {
                    return socket.emit("bid-error", "Auction not found");
                }

                if (auction.status !== "LIVE") {
                    return socket.emit("bid-error", "Auction is not Live");
                }

                if (role === "seller" && auction.sellerId.toString() === userId) {
                    return socket.emit("bid-error", "Seller cannot bid on own auction");
                }

                if (auction.highestBidder && auction.highestBidder.toString() === userId) {
                    return socket.emit("bid-error", "You already have the highest bid. Wait for another user to bid.")
                }

                if (typeof bidAmount !== "number" || bidAmount <= 0) {
                    return socket.emit("bid-error", "Invalid bid amount");
                }

                if (bidAmount % BID_DIVISIBILITY !== 0) {
                    return socket.emit("bid-error", `Bid amount must be divisible by ${BID_DIVISIBILITY}`);
                }

                if (auction.bidCount === 0) {
                    const minBid = auction.startingPrice;
                    const maxBid = auction.startingPrice + FIRST_BID_MAX_INCREMENT;
                    if (bidAmount < minBid || bidAmount > maxBid) {
                        return socket.emit("bid-error", `First bid must be between ${minBid} & ${maxBid}`);
                    }
                }
                else {
                    const minBid = auction.currentPrice + NEXT_BID_MIN_INCREMENT;
                    const maxBid = auction.currentPrice + NEXT_BID_MAX_INCREMENT;
                    if (bidAmount < minBid || bidAmount > maxBid) {
                        return socket.emit("bid-error", `Next bid must be between ${minBid} & ${maxBid}`);
                    }
                }

                const updatedAuction = await Auction.findOneAndUpdate(
                    {
                        _id: auctionId,
                        status: "LIVE",
                        currentPrice: { $lt: bidAmount }
                    },
                    {
                        $set:
                        {
                            currentPrice: bidAmount,
                            highestBidder: userId
                        },
                        $inc: { bidCount: 1 }
                    },
                    {
                        returnDocument: "after"
                    }
                );

                if (!updatedAuction) {
                    return socket.emit("bid-error", "Bid failed due to concurrent update");
                }
                await Bid.create(
                    {
                        auctionId: auctionId,
                        bidderId: userId,
                        amount: bidAmount
                    }
                );

                io.to(auctionId).emit("bid-update",
                    {
                        auctionId,
                        currentPrice: updatedAuction.currentPrice,
                        highestBidder: updatedAuction.highestBidder,
                        bidCount: updatedAuction.bidCount
                    }
                );
            } catch (e) {
                console.error("bid-error", e.message);
                socket.emit("bid-error", "Internal Server Error");
            }
        });

        socket.on("get-bid-rules", async (auctionId) => {
            try {
                const auction = await Auction.findById(auctionId);

                if (!auction || auction.status !== "LIVE") {
                    return socket.emit("bid-rules-error", "Auction not live");
                }

                let minBid, maxBid;

                if (auction.bidCount === 0) {
                    minBid = auction.startingPrice;
                    maxBid = auction.startingPrice + FIRST_BID_MAX_INCREMENT;
                } else {
                    minBid = auction.currentPrice + NEXT_BID_MIN_INCREMENT;
                    maxBid = auction.currentPrice + NEXT_BID_MAX_INCREMENT;
                }

                socket.emit("bid-rules", {
                    auctionId,
                    minBid,
                    maxBid,
                    divisibleBy: BID_DIVISIBILITY,
                    isFirstBid: auction.bidCount === 0
                });

            } catch (error) {
                console.error("Bid rules error:", error.message);
                socket.emit("bid-rules-error", "Failed to fetch bid rules");
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected : ", socket.user.userId);
        });
    });
}

export { initSocket };