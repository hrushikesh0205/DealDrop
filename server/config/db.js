import mongoose from "mongoose";
import env from "dotenv";

env.config();

async function connect()
{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Database Connected !!!");
    }catch(err)
    {
        console.error("Database Connection Failed",err);
        process.exit(1);
    }
}

export {connect};