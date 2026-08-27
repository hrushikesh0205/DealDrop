from dotenv import load_dotenv
import os
import requests
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.linear_model import LinearRegression

load_dotenv()

app = FastAPI()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


class AuctionInput(BaseModel):
    prices: list
    bidCounts: list


class DescriptionInput(BaseModel):
    title: str
    category: str


@app.get("/")
def home():
    return {"message": "ML Service Running 🚀"}


@app.head("/")
def health_check():
    return


@app.post("/recommend-price")
def recommend_price(data: AuctionInput):

    prices = data.prices
    bid_counts = data.bidCounts

    if len(prices) < 2:

        avg_price = sum(prices) / len(prices) if prices else 1000

        return {
            "suggestedStartingPrice": int(avg_price * 0.6),
            "expectedFinalPrice": int(avg_price)
        }

    df = pd.DataFrame({
        "bidCount": bid_counts,
        "price": prices
    })

    X = df[["bidCount"]]
    y = df["price"]

    model = LinearRegression()
    model.fit(X, y)

    avg_bid_count = int(df["bidCount"].mean())

    predicted_price = model.predict([[avg_bid_count]])[0]

    return {
        "suggestedStartingPrice": int(predicted_price * 0.6),
        "expectedFinalPrice": int(predicted_price)
    }


@app.post("/generate-description")
def generate_description(data: DescriptionInput):

    try:

        prompt = f"""
        Generate a professional auction description for:

        Product: {data.title}
        Category: {data.category}

        Keep it short, attractive, and suitable for an auction marketplace.
        """

        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
        )

        result = response.json()

        description = result["choices"][0]["message"]["content"]

        return {
            "description": description
        }

    except Exception as e:

        print("AI ERROR:", e)

        return {
            "description":
            f"This {data.title.lower()} belongs to the {data.category.lower()} category and is suitable for auction buyers."
        }