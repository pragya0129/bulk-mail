const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");
const axios = require("axios");

const app = express();

// Middleware
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOriginPattern = /^https:\/\/bulk-mail-9fpu(\-[a-z0-9]+)?\.vercel\.app$/;
    if (!origin || allowedOriginPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Default route
app.get("/", (req, res) => res.send("Welcome to CelebrateMate API!"));

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Email configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// MongoDB Data API Base URL and Bearer Token
const MONGODB_API_URL = process.env.MONGODB_API_URL;
const MONGODB_API_KEY = process.env.MONGODB_API_KEY;

// Helper function to interact with MongoDB Data API
const mongodbRequest = async (action, body) => {
  try {
    const response = await axios.post(
      `${MONGODB_API_URL}/action/${action}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MONGODB_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("MongoDB Data API Error:", error.response?.data || error);
    throw new Error("Database operation failed");
  }
};

// Example route to fetch emails
app.get("/api/emails", async (req, res) => {
  try {
    const query = {
      dataSource: "Cluster0",
      database: "CelebrateMate",
      collection: "emails",
      filter: { userId: req.query.userId },
    };

    const result = await mongodbRequest("find", query);
    res.status(200).json(result.documents);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Failed to fetch emails." });
  }
});

// Example route to insert an email record
app.post("/api/emails", async (req, res) => {
  try {
    const emailData = req.body;

    const query = {
      dataSource: "Cluster0",
      database: "CelebrateMate",
      collection: "emails",
      document: emailData,
    };

    await mongodbRequest("insertOne", query);
    res.status(201).json({ message: "Email record created successfully!" });
  } catch (error) {
    console.error("Error inserting email:", error);
    res.status(500).json({ error: "Failed to create email record." });
  }
});

// Bulk email sending route
app.post(
  "/send-bulk-mail",
  upload.fields([
    { name: "excelFile", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "attachments" },
  ]),
  async (req, res) => {
    try {
      const excelFileBuffer = req.files.excelFile?.[0]?.buffer;
      const logoBuffer = req.files.logo?.[0]?.buffer;
      const attachments = req.files.attachments || [];

      if (!excelFileBuffer) {
        return res
          .status(400)
          .json({ error: "Excel file is required for bulk email." });
      }

      const workbook = xlsx.read(excelFileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const emailAddresses = sheetData.map((row) => row.Email);

      if (!emailAddresses || emailAddresses.length === 0) {
        return res
          .status(400)
          .json({ error: "No email addresses found in the Excel file." });
      }

      const mailPromises = emailAddresses.map((email) => {
        const attachmentsArray = attachments.map((file) => ({
          filename: file.originalname,
          content: file.buffer,
        }));

        if (logoBuffer) {
          attachmentsArray.push({
            filename: "logo.png",
            content: logoBuffer,
            cid: "companyLogo",
          });
        }

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: req.body.subject,
          html: `
            <html>
              <body>
                ${
                  logoBuffer
                    ? `<img src="cid:companyLogo" alt="Company Logo" style="width: 15%; height: auto;"/>`
                    : ""
                }
                <p>${req.body.body}</p>
              </body>
            </html>
          `,
          attachments: attachmentsArray,
        };

        return transporter.sendMail(mailOptions);
      });

      await Promise.all(mailPromises);

      const emailRecord = {
        subject: req.body.subject,
        body: req.body.body,
        logo: logoBuffer ? "In-Memory Logo" : null,
        attachments: attachments.map((file) => file.originalname),
        recipients: emailAddresses,
      };

      const query = {
        dataSource: "Cluster0",
        database: "CelebrateMate",
        collection: "emails",
        document: emailRecord,
      };

      await mongodbRequest("insertOne", query);

      res.status(200).json({ message: "Bulk emails sent successfully!" });
    } catch (error) {
      console.error("Error sending bulk mail:", error);
      res.status(500).json({ error: "Failed to send bulk emails." });
    }
  }
);

module.exports = app;
