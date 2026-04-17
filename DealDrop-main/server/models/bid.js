import mongoose from "mongoose";

const bidSchema = mongoose.Schema(
    {
        auctionId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
            required: true
        },
        bidderId: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount:
        {
            type : Number,
            required : true,
            min : 0
        }
    },
    {
        timestamps : true
    }
);

const Bid = mongoose.model("Bid",bidSchema);

export {Bid};