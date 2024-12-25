const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  logo: { type: String }, // Store logo as base64 or CID reference
  attachments: [{ type: String }], // List of attachment file paths or base64 data
  recipients: [{ type: String }], // List of email addresses
  sentAt: { type: Date, default: Date.now }, // Timestamp of when the email was sent
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
