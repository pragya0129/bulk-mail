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

const corsOptions = {
  origin: function (origin, callback) {
    // Adjust regex to match both dynamic frontend domains
    const allowedOriginPattern =
      /^https:\/\/bulk-mail-9fpu(\-[a-z0-9]+)?\.vercel\.app$/;
    if (!origin || allowedOriginPattern.test(origin)) {
      callback(null, true); // Allow the origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Required for cookies or Authorization headers
};

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});

// Apply the CORS middleware globally
app.use(cors(corsOptions));

// Import and use routes
const userRoutes = require("./routes/userRoutes");
const mailRoutes = require("./routes/mailRoutes");
const verifyToken = require("./middleware/auth");
app.use("/api", userRoutes);
app.use("/api", mailRoutes);

let isConnected;

const connectDb = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  console.log("Creating new database connection");
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // Remove useUnifiedTopology as it is no longer necessary
  });
  isConnected = db.connections[0].readyState;
};

app.use(async (req, res, next) => {
  await connectDb();
  next();
});

// Default route
app.get("/", (req, res) => res.send("Welcome to CelebrateMate API!"));

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Email configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or use your email service provider
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.EMAIL_PASSWORD, // Replace with your email password or app-specific password
  },
});

app.post(
  "/send-bulk-mail",
  upload.fields([
    { name: "excelFile", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "attachments" },
  ]),
  async (req, res) => {
    try {
      const userId = req.body.userId;
      const excelFileBuffer = req.files.excelFile?.[0]?.buffer;
      const logoBuffer = req.files.logo?.[0]?.buffer;
      const attachments = req.files.attachments || [];

      if (!excelFileBuffer) {
        return res
          .status(400)
          .json({ error: "Excel file is required for bulk email." });
      }

      // Process the Excel file
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
            filename: "logo.png", // Name of the logo file
            content: logoBuffer,
            cid: "companyLogo", // Content-ID for referencing in the email
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

      const newEmail = new Email({
        subject: req.body.subject,
        body: req.body.body,
        logo: logoBuffer ? "In-Memory Logo" : null,
        attachments: attachments.map((file) => file.originalname),
        recipients: emailAddresses,
        userId: userId,
      });

      await newEmail.save();

      res.status(200).json({ message: "Bulk emails sent successfully!" });
    } catch (error) {
      console.error("Error sending bulk mail:", error);
      res.status(500).json({ error: "Failed to send bulk emails." });
    }
  }
);

app.get("/api/emails", verifyToken, async (req, res) => {
  try {
    const emails = await Email.find({ userId: req.user.id });
    res.status(200).json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Failed to fetch emails." });
  }
});

router.get("/email/logo/:emailId", async (req, res) => {
  try {
    const email = await Email.findById(req.params.emailId);
    if (!email || !email.logo) {
      return res.status(404).json({ error: "Logo not found" });
    }

    res.set("Content-Type", "image/png"); // Adjust based on the stored format
    res.send(email.logo);
  } catch (error) {
    console.error("Error fetching logo:", error);
    res.status(500).json({ error: "Failed to fetch logo" });
  }
});

module.exports = app;
