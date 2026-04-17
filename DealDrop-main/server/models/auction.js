import mongoose from "mongoose";

const auctionSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is Required"]
        },
        description : {
            type : String
        },
        startingPrice: {
            type: Number,
            required: [true, "Staring Price is Required"],
            min : 0
        },
        startTime : {
            type : Date,
            required : [true,"Start Time is Required"]
        },
        endTime : {
            type : Date,
            required : [true,"End Time is Required"]
        },
        sellerId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        status : {
            type : String,
            enum : ["UPCOMING","LIVE","ENDED","PAID"],
            default : "UPCOMING"
        },
        currentPrice  : {
            type : Number,
            default : function(){
                return this.startingPrice;
            }
        },
        bidCount : {
            type : Number,
            default : 0
        },
        highestBidder : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            default : null
        },
        winnerId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            default : null
        },
        isBlocked : {
            type : Boolean,
            default : false
        },
        image : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)

const Auction = mongoose.model("Auction",auctionSchema);

export {Auction};