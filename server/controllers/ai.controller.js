import { generateAIDescription } from "../services/ai.service.js";

async function generateDescription(req,res)
{
    try{
        const {title,category} = req.body;

        const result = await generateAIDescription(title,category)
        return res.status(200).json(result);
    }catch(e)
    {
        console.error(e);
        return res.status(500).json({
            message: "AI generation failed"
        });
    }
}

export {generateDescription}