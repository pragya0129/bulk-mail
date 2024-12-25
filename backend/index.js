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
const path = require("path");

// Apply middlewares first
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["https://bulk-mail-9fpu.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

// Import and use routes
const userRoutes = require("./routes/userRoutes");
const mailRoutes = require("./routes/mailRoutes");
const verifyToken = require("./middleware/auth");
app.use("/api", userRoutes);
app.use("/api", mailRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

app.use(async (req, res, next) => {
  await connectDb();
  next();
});

// Default route
app.get("/", (req, res) => res.send("Welcome to CelebrateMate API!"));

const upload = multer({ dest: "uploads/" });

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
    { name: "excelFile", maxCount: 1 }, // Handle the Excel file
    { name: "logo", maxCount: 1 }, // Handle the logo (optional)
    { name: "attachments" }, // Handle multiple attachments
  ]),
  async (req, res) => {
    try {
      // Access uploaded files
      const userId = req.body.userId;
      const excelFile = req.files.excelFile?.[0];
      const logo = req.files.logo?.[0];
      const attachments = req.files.attachments || [];

      if (!excelFile) {
        return res
          .status(400)
          .json({ error: "Excel file is required for bulk email." });
      }

      // Process the Excel file
      const workbook = xlsx.readFile(excelFile.path);
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Extract email addresses
      const emailAddresses = sheetData.map((row) => row.Email);

      if (!emailAddresses || emailAddresses.length === 0) {
        return res
          .status(400)
          .json({ error: "No email addresses found in the Excel file." });
      }

      // Prepare the HTML body with the logo image embedded
      let htmlBody = `
        <html>
          <body>
            ${
              logo
                ? `<img src="cid:companyLogo" alt="Company Logo" style="width: 15%; height: auto;"/>`
                : ""
            }
            <p>${req.body.body}</p>
          </body>
        </html>
      `;

      // Email sending logic
      const mailPromises = emailAddresses.map((email) => {
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: req.body.subject,
          html: htmlBody, // HTML body with logo embedded
          attachments: [
            ...(logo
              ? [
                  {
                    filename: logo.originalname,
                    path: logo.path,
                    cid: "companyLogo", // CID reference for embedding
                  },
                ]
              : []),
            ...attachments.map((file) => ({
              filename: file.originalname,
              path: file.path,
            })),
          ],
        };

        return transporter.sendMail(mailOptions);
      });

      await Promise.all(mailPromises);

      const newEmail = new Email({
        subject: req.body.subject,
        body: req.body.body,
        logo: logo ? logo.path : null, // Save logo path (or base64 if you prefer)
        attachments: attachments.map((file) => file.path), // Save attachment paths
        recipients: emailAddresses,
        userId: userId, // Use the authenticated user's ID
      });

      // Save to the database
      await newEmail.save();

      res.status(200).json({ message: "Bulk emails sent successfully!" });
    } catch (error) {
      console.error("Error sending bulk mail:", error);
      res.status(500).json({ error: "Failed to send bulk emails." });
    }
  }
);

app.get("/api/emails", async (req, res) => {
  try {
    const emails = await Email.find({ userId: req.user.id }); // Fetch emails for the logged-in user
    res.status(200).json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Failed to fetch emails." });
  }
});
