const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
require("dotenv").config();

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Sample users and API keys (for demonstration purposes)
let apiKeys = [
  { apiKey: "abc123", userId: 1 },
  { apiKey: "def456", userId: 2 },
];

// Middleware to validate API key
function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ msg: "API Key is required" });
  }

  const isValid = apiKeys.some((key) => key.apiKey === apiKey);
  if (!isValid) {
    return res.status(403).json({ msg: "Invalid API Key" });
  }

  next();
}

// Endpoint to generate a new API key
app.post("/api/generate-api-key", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  const newApiKey = uuid.v4();
  apiKeys.push({ apiKey: newApiKey, userId });

  res.status(201).json({ apiKey: newApiKey });
});

// Public API endpoints
app.post("/api/public/profile", validateApiKey, (req, res) => {
  const apiKey = req.headers["x-api-key"];
  const user = apiKeys.find((key) => key.apiKey === apiKey);

  // Example response
  res.json({
    userId: user.userId,
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
  });
});

app.get("/api/public/candidate", validateApiKey, (req, res) => {
  const apiKey = req.headers["x-api-key"];
  const user = apiKeys.find((key) => key.apiKey === apiKey);

  // Example response
  res.json({
    userId: user.userId,
    candidates: [
      {
        firstName: "Candidate1",
        lastName: "Doe",
        email: "candidate1@example.com",
      },
      {
        firstName: "Candidate2",
        lastName: "Smith",
        email: "candidate2@example.com",
      },
    ],
  });
});

// Start server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () =>
  console.log(`Public API Microservice running on port ${PORT}`)
);
