const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); 

    if (decoded.role !== "admin") {
      console.error("Access denied due to invalid role:", decoded.role); 
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.admin = decoded; 
    next(); 
  } catch (error) {
    console.error("Invalid token:", error.message);
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = adminAuth;
