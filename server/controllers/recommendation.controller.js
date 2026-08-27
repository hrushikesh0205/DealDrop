import { getPriceRecommendation } from "../services/recommendation.service.js";

async function recommendPrice(req, res) {
    try {
        const { title, category } = req.query;

        if (!title || !category) {
            return res.status(400).json({
                message: "Title and category required"
            });
        }

        const result = await getPriceRecommendation(title, category);
        console.log("Controller result:", result);

        return res.status(200).json(result);
    } catch (e) {
        console.error(
            "AI ERROR:",
            e.response?.data || e.message
        );
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { recommendPrice };