const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const multer = require("multer");
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");
const Email = require("./models/Email");
const app = express();

// Middleware
app.use(bodyParser.json());

// Enhanced CORS Configuration
const allowedOrigins = [
  "https://bulk-mail-nu.vercel.app",
  "https://bulk-mail-9fpu.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Debugging Middleware
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  console.log("Request Method:", req.method);
  next();
});

// Database Connection
let isConnected = false;

const connectDb = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  console.log("Creating new database connection");
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = db.connections[0].readyState;
};

// Ensure DB connection before processing any request
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
const userRoutes = require("./routes/userRoutes");
const mailRoutes = require("./routes/mailRoutes");
const verifyToken = require("./middleware/auth");

app.use("/api", userRoutes);
app.use("/api", mailRoutes);

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

// Bulk Mail Route
app.post(
  "/send-bulk-mail",
  upload.fields([
    { name: "excelFile", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "attachments" },
  ]),
  async (req, res) => {
    try {
      const { userId, subject, body } = req.body;
      const excelFileBuffer = req.files.excelFile?.[0]?.buffer;
      const logoBuffer = req.files.logo?.[0]?.buffer;
      const attachments = req.files.attachments || [];

      if (!excelFileBuffer) {
        return res.status(400).json({ error: "Excel file is required." });
      }

      const workbook = xlsx.read(excelFileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const emailAddresses = sheetData.map((row) => row.Email);
      if (!emailAddresses || emailAddresses.length === 0) {
        return res.status(400).json({ error: "No email addresses found." });
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
          subject,
          html: `
            <html>
              <body>
                ${
                  logoBuffer
                    ? `<img src="cid:companyLogo" alt="Logo" style="width: 15%;"/>`
                    : ""
                }
                <p>${body}</p>
              </body>
            </html>
          `,
          attachments: attachmentsArray,
        };

        return transporter.sendMail(mailOptions);
      });

      await Promise.all(mailPromises);

      const newEmail = new Email({
        subject,
        body,
        logo: logoBuffer ? "In-Memory Logo" : null,
        attachments: attachments.map((file) => file.originalname),
        recipients: emailAddresses,
        userId,
      });

      await newEmail.save();

      res.status(200).json({ message: "Bulk emails sent successfully!" });
    } catch (error) {
      console.error("Error sending bulk mail:", error);
      res.status(500).json({ error: "Failed to send bulk emails." });
    }
  }
);

// Fetch Emails Route
app.get("/api/emails", verifyToken, async (req, res) => {
  try {
    const emails = await Email.find({ userId: req.user.id });
    res.status(200).json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Failed to fetch emails." });
  }
});

module.exports = app;
