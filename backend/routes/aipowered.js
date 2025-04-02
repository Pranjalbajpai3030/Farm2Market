const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/get-crop-prices", async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    // Improved prompt to enforce strict JSON format
    const prompt = `
   Generate **ONLY** a valid JSON array of **crop prices for all crops that can be sown in India**.  
**Do NOT include explanations, notes, or additional text.**  

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

**Strict Rules:**  
- Output **ONLY JSON** (without markdown formatting, code blocks, or explanations).  
- Include **all crops that can be grown in India**, covering grains, pulses, oilseeds, fruits, vegetables, spices, and commercial crops.  
- Prices should be realistic based on recent market trends.  
- Ensure the recommended selling price is optimized for **maximum farmer profit**.  
- Provide **NO additional text** before or after the JSON output.  

Return **ONLY the JSON array**.

    `;

    try {
        const result = await model.generateContent(prompt);
        let jsonResponse = await result.response.text();

        // Force clean JSON output
        jsonResponse = jsonResponse.replace(/```json\n|\n```/g, "").trim();

        try {
            const parsedResponse = JSON.parse(jsonResponse);
            res.json(parsedResponse);
        } catch (parseError) {
            console.error("JSON Parsing Error:", parseError);
            return res.status(500).json({ error: "Failed to parse JSON response", raw: jsonResponse });
        }
    } catch (error) {
        console.error("Error generating crop prices:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/trend-crop-prices", async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    // Improved prompt to enforce strict JSON format
 const trendPrompt = `
    Generate **ONLY** a JSON array of the **top 5 trending crops** in the region with latitude ${latitude} and longitude ${longitude}.  
    **Do NOT include explanations, notes, or additional text.**  

    The JSON format should be:

    [
      "Crop 1",
      "Crop 2",
      "Crop 3",
      "Crop 4",
      "Crop 5"
    ]

    **Strict Rules:**  
    - Output **ONLY JSON** (no markdown, no explanations).  
    - Select the trending crops based on **market demand and recent price trends**.  
    - Provide **NO additional text** before or after the JSON output.  
    `;

    try {
        const [priceResult, trendResult] = await Promise.all([
            model.generateContent(pricePrompt),
            model.generateContent(trendPrompt),
        ]);

        let priceResponse = await priceResult.response.text();
        let trendResponse = await trendResult.response.text();

        // Clean the responses to ensure they are pure JSON
        priceResponse = priceResponse.replace(/```json\n|\n```/g, "").trim();
        trendResponse = trendResponse.replace(/```json\n|\n```/g, "").trim();

        try {
            const prices = JSON.parse(priceResponse);
            const trendingCrops = JSON.parse(trendResponse);

            res.json({
                crop_prices: prices,
                trending_crops: trendingCrops,
            });
        } catch (parseError) {
            console.error("JSON Parsing Error:", parseError);
            return res.status(500).json({
                error: "Failed to parse JSON response",
                raw_prices: priceResponse,
                raw_trends: trendResponse,
            });
        }
    } catch (error) {
        console.error("Error generating crop data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
