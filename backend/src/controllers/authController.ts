import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User.model";
import type { Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";

export const getMe = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		res.json({ user });
	} catch (error) {
		next(error);
	}
};

export const authCallback = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId: clerkId, isAuthenticated } = getAuth(req);

		if (!clerkId || !isAuthenticated) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		let user = await User.findOne({ clerkId });
		if (!user) {
			//get user info from clerk
			const clerkUser = await clerkClient.users.getUser(clerkId);
			user = await User.create({
				clerkId,
				name: clerkUser.firstName
					? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
					: clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] || "User",
				email: clerkUser.emailAddresses[0]?.emailAddress,
				avatar: clerkUser.imageUrl,
			});
		}
	} catch (error) {
		next(error);
	}
};
