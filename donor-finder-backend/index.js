import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import donorRoutes from "./routes/donors.js";
import adminRoutes from "./routes/admin.js";
import commentsRoutes from "./routes/comments.js";
import usersRoutes from "./routes/users.js"; // ✅ Add this

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/users", usersRoutes); // ✅ Mount route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
