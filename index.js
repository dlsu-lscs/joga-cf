require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Root route
app.post('/', async (req, res) => {
  try {
    // Extract data from the request body

    // Make a POST request to the external API with an Authorization header
    const response = await axios.post(
      'https://auth.app.dlsu-lscs.org/member-id',
      `{ "id": ${req.query.id} }`, // Pass the ID in the request body
      {
        headers: {
          Authorization: `Bearer ${process.env.LSCS_API_KEY}`, // Use the API key from the environment variables
          'Content-Type': 'application/json'
        },
      }
    );
    console.log('passed 1');
    console.log(response.data)

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const data = {
      contents: [
        {
          parts: [
            {
              text: `
### PROMPT
Generate a FUN_FACT and STATISTIC_FACT about the given {FIRST_NAME} and {LAST_NAME}

### FUN_FACT
An origin, or what the name means, or whatever is interesting about the name.

### STATISTIC_FACT
APPROXIMATE_NUMBER: Statistics on how much people in the world has their name. 
CATEGORY: Categorize their name in to three tiers: "Common" where count is > 1,000,000, Uncommon where count is > 100,000, and Rare where count is >10,000.
ORIGIN: Country of origin of LAST_NAME

### FIRST_NAME, LAST_NAME
Parse first name from {FULL_NAME}, which has the format: Firstname Lastname

### FULL_NAME
${response.data.full_name}

### OUTPUT FORMAT (Do not include "(DID YOU KNOW?)" in the output format, it is just given for context in name generation.)
(DID YOU KNOW?) Your first name, "{FIRST_NAME}" means {fun fact}? Your surname {LAST_NAME}, originated from "origin", and there are approximately {APPROXIMATE_NUMBER} people in the world with your surname, making it fairly {CATEGORY}.

              ` }
          ]
        }
      ]
    };

    const headers = {
      'Content-Type': 'application/json'
    };

    axios.post(url, data, { headers })
      .then(resp => {
        res.send({ lscs_data: response.data, llm_data: resp.data })
        console.log(resp.data);
      })
      .catch(error => {
        console.error(error);
      });
    console.log('passed 2')

    // Return the response from the external API
  } catch (error) {
    console.error('Error occurred:', error.message);

    // Handle errors
    if (error.response) {
      // External API returned an error response
      res.status(error.response.status).json(error.response.data);
    } else {
      // Other errors
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

