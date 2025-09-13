import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "adminsupersecret";

// normal user middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { user_id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
};

// admin middleware
export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    req.admin = decoded; // { admin_id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid/expired admin token" });
  }
};

export default authMiddleware;
