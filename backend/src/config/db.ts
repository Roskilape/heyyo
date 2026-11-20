import mongoose from "mongoose";
import dns from "node:dns";

// The local DNS resolver refuses Atlas SRV lookups; use public resolvers.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

export const connectDB = async () => {
	try {
		const mongoURI = process.env.MONGO_URI as string;
		if (!mongoURI) {
			throw new Error("MONGO_URI is not defined in environment variables");
		}
		const conn = await mongoose.connect(mongoURI);
		console.log(`Database connected ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connecting to database", error);
		process.exit(1); // exit with failure
	}
};
