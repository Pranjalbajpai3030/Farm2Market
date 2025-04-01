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
    Generate a JSON array of current crop prices for a given location based on latitude and longitude. 
    The JSON format should be:
    
    [
      { "name": "Crop Name", "price": "₹XXXX/unit", "trend": "up/down", "change": "+/-X.X%" },
      ...
    ]

    The crop list should be relevant to the geographical region provided (latitude: ${latitude}, longitude: ${longitude}).
    Also, consider recent market trends in agriculture while generating the data.
    
    The response should be a valid JSON array without additional text or formatting.
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
