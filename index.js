require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware
const nodemailer = require('nodemailer')
const app = express();
const PORT = 3000;

const scanned = [];

// Enable CORS for all routes
app.use(cors());

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
          'Content-Type': 'application/json',
        },
      }
    );
    scanned.push(req.query.id)

    if (!scanned.includes(req.query.id)) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER, // your email
          pass: process.env.SMTP_PASS, // your email password,
        },
      });

      // Service to send email with the API key
      try {
        let info = await transporter.sendMail({
          from: `"LSCS Research and Develpoment" <${process.env.SMTP_USER}>`, // sender address
          to: response.data.email, // receiver's email
          subject: '[LSCS] Join the Research and Development Committee!', // Subject line
          html: `<body style="margin: 0; font-family: Arial, sans-serif; background-color: #f0f8ff; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #0074cc; color: #ffffff; text-align: center; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">RESEARCH AND DEVELOPMENT</h1>
        </div>
        <div style="padding: 20px;">
            <h2 style="color: #0074cc; font-size: 20px; margin-top: 20px;">WHO ARE WE?</h2>
            <p>The Research and Development Committee (RND) is the dedicated technical and software development team of the La Salle Computer Society (LSCS), the premier student organization of the College of Computer Studies at De La Salle University.</p>
            <p>RND is composed of passionate, skilled, and driven individuals who collaborate to build innovative solutions that cater to the needs of the Lasallian community and beyond. As a key player in LSCS, RND stands as a hub for technological advancement and a training ground for future leaders in the fields of Computer Science and Information Technology.</p>

            <h2 style="color: #0074cc; font-size: 20px; margin-top: 20px;">WHAT WE DO?</h2>
            <p><strong>Innovate for Impact</strong><br>
            We design, develop, and deploy technology-driven solutions to real-world problems. From crafting websites to creating full-fledged applications, RND provides the tools and services that empower individuals and organizations to thrive in a digital landscape.</p>

            <p><strong>Pioneer Research in Emerging Technologies</strong><br>
            As technology evolves, so do we. RND actively explores current and emerging trends in software development, artificial intelligence, user experience, and more. By staying ahead of the curve, we ensure our projects integrate cutting-edge tools and practices, making them both practical and forward-looking.</p>

            <h2 style="color: #0074cc; font-size: 20px; margin-top: 20px;">OUR MISSION</h2>
            <p>To empower the Lasallian community with innovative, impactful, and accessible technical solutions while nurturing the next generation of technology professionals.</p>

            <h2 style="color: #0074cc; font-size: 20px; margin-top: 20px;">OUR VISION</h2>
            <p>To be a hub of innovation and technical excellence within LSCS and the College of Computer Studies, known for its commitment to quality and relevance in the tech space.</p>

            <h2 style="color: #0074cc; font-size: 20px; margin-top: 20px;">KEY FEATURES OF RND</h2>
            <ul>
                <li>Team Structure: A well-defined hierarchy ensures effective collaboration across specialized roles, from developers and designers to senior engineers and project leads.</li>
                <li>MERN Stack Expertise: Our standard development framework includes MongoDB, ExpressJS, React, and Node.js, while remaining adaptable to project-specific needs.</li>
                <li>Real-World Workflow: AGILE methodologies guide our project development, simulating the professional environment and preparing members for industry expectations.</li>
                <li>Impactful Projects: Whether developing tools for the Lasallian community or exploring new tech frontiers, RND’s projects aim to make a lasting difference.</li>
            </ul>

            <h2 style="color: #0074cc; font-size: 20px; margin-top: 20px;">WHY JOIN RND?</h2>
            <p>Gain hands-on experience with cutting-edge technologies.<br>
            Collaborate with like-minded peers and develop leadership skills.<br>
            Build a portfolio of projects that showcase your technical expertise.<br>
            Prepare for future careers in the tech industry by working in a simulated professional environment.</p>

            <h2 style="color: #0074cc; font-size: 20px; margin-top: 20px;">TERM 2 NEEDED JUNIOR OFFICERS</h2>
            <p>To continue delivering high-quality outputs and pushing forward our initiatives, RND is looking for junior officers for Term 2 in the following roles:</p>
            <ul>
                <li>Database Administration</li>
                <li>Quality Assurance Engineers</li>
                <li>UI/UX Designers</li>
                <li>Frontend/Backend Engineers</li>
            </ul>
            <p>This is your opportunity to contribute to meaningful projects, develop your skills, and be part of a dynamic and supportive team.</p>

            <h2 style="color: #0074cc; font-size: 20px; margin-top: 20px;">OUR COMMITMENT</h2>
            <p>The RND Committee is committed to fostering a collaborative and supportive environment where creativity thrives, technical expertise flourishes, and members are equipped to make meaningful contributions to the tech community. Together, we aim to redefine what’s possible through technology.</p>
        </div>
        <div style="background-color: #f0f8ff; text-align: center; padding: 15px; font-size: 12px; color: #666;">
            <p>Want to know more? Visit <a href="https://dlsu-lscs.org" style="color: #0074cc; text-decoration: none;">LSCS</a> or contact us at <a href="mailto:sean_robenta@dlsu.edu.ph" style="color: #0074cc; text-decoration: none;">sean_robenta@dlsu.edu.ph</a>.</p>
        </div>
    </div>
</body>`, // plain text body
        });

        console.log('Message sent: %s', info.messageId);
      } catch (error) {
        console.error('Error sending email:', error);
      }

    }
    console.log('passed 1');
    console.log(response.data);

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

              `,
            },
          ],
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    axios
      .post(url, data, { headers })
      .then((resp) => {
        res.send({ lscs_data: response.data, llm_data: resp.data });
        console.log(resp.data);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log('passed 2');

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

