import {Auction} from "../models/auction.js";
import { cloudinary } from "../config/cloudinary.js";

async function createAuction(req, res) {
    try {
        const { title, description, startingPrice, startTime, endTime } = req.body;

        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        if (!title || !startingPrice || !startTime || !endTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        if (start <= now) {
            return res.status(400).json({ message: "Enter Valid Start Date" });
        }

        if (end <= start) {
            return res.status(400).json({ message: "Enter Valid End Date" });
        }

        // 🔥 Wrap cloudinary upload in promise
        const uploadImage = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "auctions" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                stream.end(req.file.buffer);
            });
        };

        const uploadResult = await uploadImage();

        const auction = await Auction.create({
            title,
            description,
            startingPrice,
            startTime,
            endTime,
            sellerId: req.user.userId,
            image: uploadResult.secure_url
        });

        return res.status(201).json({
            message: "Auction Created Successfully",
            auction
        });

    } catch (e) {
        console.error("Create auction failed:", e.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getAllAuctions(req,res)
{
    try{
        const auctions = await Auction.find().sort({createdAt : -1});
        res.status(200).json(auctions);
    } catch (e)
    {
        res.status(500).json({ message: "Failed to fetch auctions" });
    }
}

async function getAuctionById(req,res)
{
    try{
        const {id} = req.params;
        const auction = await Auction.findById(id)
        .populate("winnerId","name email")
        .populate("highestBidder","name");

        if(!auction)
        {
            return res.status(404).json({message : "Auction Not Found"});
        }

        return res.status(200).json(auction);
    }catch(e)
    {
        console.error(e.message);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

async function getMyAuctions(req,res)
{
    try{
        const userId = req.user.userId;
        const auctions = await Auction.find(
            {
                sellerId : userId
            }
        ).populate("winnerId","name").sort({ createdAt:-1});

        res.status(200).json(auctions);
    }catch(e)
    {
        console.error(e.message);
        res.status(500).json({ message : "Failed to fetch auctions"});
    }
}

export {createAuction,getAllAuctions,getAuctionById,getMyAuctions};