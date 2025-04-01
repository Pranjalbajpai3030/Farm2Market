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
    Generate **ONLY** a valid JSON array of **profitable crop prices** based on the provided latitude and longitude. 
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
    - Include at least **8-12 profitable crops** for latitude: ${latitude}, longitude: ${longitude}.  
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

module.exports = router;
