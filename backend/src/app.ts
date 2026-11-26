import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import chatRoutes from "./routes/chatRoutes";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middleware/errorHandler";
const app = express();

app.get("/health", (req, res) => {
	res.json({ status: "ok", message: "Server is running" });
});

app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api", (_req, res) => res.status(404).json({ message: "Not found" }));

app.use(errorHandler);

export default app;
