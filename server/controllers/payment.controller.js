import { razorpay } from "../config/razorpay.js";
import { Auction } from "../models/auction.js";
import crypto from "crypto";

async function createOrder(req,res)
{
    try{
        const {auctionId} = req.body;
        const auction = await Auction.findById(auctionId);
        if(!auction)
        {
            return res.status(404).json({message : "Auction not found"});
        }

        if(auction.winnerId.toString() !== req.user.userId)
        {
            return res.status(403).json({ message : "Not Authorized"});
        }

        const options = {
            amount : auction.currentPrice * 100,
            currency: "INR",
            receipt : `receipt_${auctionId}`
        }

        const order = await razorpay.orders.create(options);

        res.status(200).json(order);
    }catch(e)
    {
        console.error(e);
        res.status(500).json({ message: "Order creation failed" });
    }
}

async function verifyPayment(req,res)
{
    try{
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            auctionId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        await Auction.findByIdAndUpdate(auctionId, {
            status: "PAID"
        });

        res.json({ message: "Payment successful" });

    } catch (e) {
        res.status(500).json({ message: "Payment verification failed" });
    }
}

export {createOrder,verifyPayment};