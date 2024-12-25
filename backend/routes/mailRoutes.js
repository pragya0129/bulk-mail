const express = require("express");
const jwt = require("jsonwebtoken");
const EMail = require("../models/Email"); // Assuming you have a Mail model
const User = require("../models/User"); // Assuming you have a User model
const verifyToken = require("../middleware/auth"); // Import the verifyToken middleware
const router = express.Router();

// Route to fetch mails for a specific user
router.get("/mails/:userId", verifyToken, async (req, res) => {
  // Check if the userId from the token matches the userId in the URL
  if (req.params.userId !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "User not authorized to access events" });
  }

  try {
    // Fetch the mails associated with the userId
    const mails = await EMail.find({ userId: req.params.userId }); // Sort by createdAt (newest first)
    res.status(200).json(mails);
  } catch (error) {
    console.error("Error fetching mails:", error);
    res.status(500).json({ error: "Failed to fetch mails" });
  }
});

router.delete("/deleteMail/:id", async (req, res) => {
  console.log("Received DELETE request for mail ID:", req.params.id);

  try {
    const mail = req.params.id;
    const deletedMail = await EMail.findByIdAndDelete(mail);

    if (!deletedMail) {
      console.log("Mail not found:", eventId);
      return res.status(404).json({ message: "Mail not found" });
    }

    console.log("Deleted mail:", deletedMail);
    res.status(200).json({ message: "Mail deleted successfully" });
  } catch (error) {
    console.error("Error deleting mail:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;
