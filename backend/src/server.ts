import app from "./app";
import { connectDB } from "./config/db";
import { createServer } from "http";
import { initializeSocket } from "./utils/socket";
import job from "./config/cron";

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

initializeSocket(httpServer);

const prepareWeb = async () => {
	if (process.env.NODE_ENV === "production") {
		const { createWebHandler } = await import("../../web/server");
		const handleWeb = await createWebHandler(httpServer);
		app.use((req, res, next) => {
			void handleWeb(req, res).catch(next);
		});
	}
};

Promise.all([connectDB(), prepareWeb()])
	.then(() => {
		httpServer.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
			job.start();
		});
	})
	.catch((err) => {
		console.error("Failed to connect to the database", err);
		process.exit(1);
	});
