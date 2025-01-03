require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret ='MzM2YjQ4NDM0NjZmNTc3NTQ5NTY0MjYzNjc3MzZlNmY=';
const generateToken = (username, id) => {
  const token = jwt.sign(
    {
      username,
      userId:id
    },
    secret,
    { expiresIn: "24h" }
  );
  return token;
};

const authenticateToken = async (req, reply) => {
  const token = req.headers.authorization;
            
  if (!token) {
    return reply.status(401).send({ error: "Missing access token" });
  }

  try {
    const decodedToken = jwt.verify(token, secret);
    req.user = decodedToken;
  } catch (err) {
    return reply.status(403).send({ error: "Invalid access token" });
  }
};


module.exports={generateToken,authenticateToken}