const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from the "Bearer <token>" format
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    // Replace 'your-secret-key' with your actual secret key
    const verified = jwt.verify(token, "4fC3hG!k9&V2sSyd88#yPZ9oQ7");
    req.user = verified; // Attach the verified user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
