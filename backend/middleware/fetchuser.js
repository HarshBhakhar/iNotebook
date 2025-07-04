var jwt = require('jsonwebtoken');
const jwt_secret = "Harryisbdab4oy"

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token")
  if (!token || token === "undefined") {
    res.status(401).send({ error: "please authenticate with valid token" })
  }

  try {
    const data = jwt.verify(token, jwt_secret);
    req.user = data.user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message); // Optional for debugging
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }
}

module.exports = fetchuser; 