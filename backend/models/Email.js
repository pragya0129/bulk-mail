const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  logo: { type: Buffer }, // Store logo as base64 or CID reference
  attachments: [{ type: String }], // List of attachment file paths or base64 data
  recipients: [{ type: String }], // List of email addresses
  sentAt: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toISOString().slice(0, 19).replace("T", " "); // Format: 'YYYY-MM-DD HH:mm:ss'
    },
  }, // Timestamp of when the email was sent
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
