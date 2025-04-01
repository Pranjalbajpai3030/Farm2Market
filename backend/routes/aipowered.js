const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/get-crop-prices", async (req, res) => {
    const { latitude, longitude } = req.body;

    // Validate input
    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    // Strong prompt to get crop prices based on location
    const prompt = `
    Generate a JSON array of **profitable crop prices** for a given location based on latitude and longitude.
The JSON format should be:

[
  {
    "name": "Crop Name",
    "govt_price": "₹XXXX/unit",
    "market_price": "₹XXXX/unit",
    "recommended_selling_price": "₹XXXX/unit",
    "trend": "up/down",
    "change": "+/-X.X%",
    "profitability": "High/Medium/Low"
  },
  ...
]

### Requirements:
1. Include **at least 8-12 crops** that are **most profitable for farmers** in the given location.
2. The **government price** (MSP - Minimum Support Price) should reflect official rates.
3. The **market price** should be based on recent trends in local mandis.
4. The **recommended selling price** should be calculated such that farmers **maximize their profit margins** while staying competitive in the market.
5. The **trend** should indicate if the price is rising or falling.
6. The **profitability** should be categorized as **High, Medium, or Low** based on demand and margin.
7. Ensure the data aligns with real-world agricultural market trends for the provided **latitude: ${latitude}, longitude: ${longitude}**.

### Example Output:
[
  {
    "name": "Wheat",
    "govt_price": "₹2200/quintal",
    "market_price": "₹2500/quintal",
    "recommended_selling_price": "₹2400/quintal",
    "trend": "up",
    "change": "+3.2%",
    "profitability": "High"
  },
  {
    "name": "Tomato",
    "govt_price": "₹20/kg",
    "market_price": "₹30/kg",
    "recommended_selling_price": "₹28/kg",
    "trend": "down",
    "change": "-1.5%",
    "profitability": "Medium"
  }
]

### Output Format:
The response should be a **valid JSON array** with no additional text or formatting.
`;

    try {
        const result = await model.generateContent(prompt);

        // Get the text response
        const jsonResponse = await result.response.text();

        // Clean and parse the response
        const cleanedResponse = jsonResponse.replace(/```json\n|\n```/g, "").trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            return res.status(500).json({ error: "Failed to parse JSON response", raw: cleanedResponse });
        }

        // Send parsed JSON response
        res.json(parsedResponse);
    } catch (error) {
        console.error("Error generating crop prices:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
