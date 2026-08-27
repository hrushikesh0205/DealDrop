import axios from 'axios';
import { Auction } from "../models/auction.js";

async function getPriceRecommendation(title, category) {
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let auctions = await Auction.find({
        category,
        title: { $regex: escapedTitle, $options: "i" },
        status: "ENDED"
    });


    // 🔥 FALLBACK TO CATEGORY DATA
    if (auctions.length < 2) {
        auctions = await Auction.find({
            category,
            status: "ENDED"
        });
    }


    // 🔥 FALLBACK TO GLOBAL DATA
    if (auctions.length < 2) {
        auctions = await Auction.find({
            status: "ENDED"
        }).limit(20);
    }

    const prices = auctions.map(a => a.currentPrice);
    const bidCounts = auctions.map(a => a.bidCount);

    console.log("Prices:", prices);
    console.log("BidCounts:", bidCounts);

    const response = await axios.post(`${process.env.ML_SERVICE_URL}/recommend-price`,
        {
            title,
            prices,
            bidCounts
        }
    );

    console.log("Python response:", response.data);

    return response.data;
}

export { getPriceRecommendation };