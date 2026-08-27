import axios from 'axios'

async function generateAIDescription(title,category)
{
    console.log("ML URL:", process.env.ML_SERVICE_URL);
    const res = await axios.post(`${process.env.ML_SERVICE_URL}/generate-description`,
        {
            title,
            category
        }
    );

    console.log("");

    return res.data;
}

export {generateAIDescription};