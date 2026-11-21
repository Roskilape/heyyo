import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat.model";

export async function getChats(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(400).json({ message: "User ID not found" });
		}

		const chat = await Chat.find({ participants: userId })
			.populate("participants", "name email avatar")
			.populate("lastMessage")
			.sort({ lastMessageAt: -1 });

		const formattedChats = chat.map((chat) => {
			const otherParticipant = chat.participants.find(
				(p) => p._id.toString() !== userId,
			);
			return {
				_id: chat._id,
				participants: otherParticipant ? otherParticipant : [],
				lastMessage: chat.lastMessage,
				lastMessageAt: chat.lastMessageAt,
				createdAt: chat.createdAt,
				updatedAt: chat.updatedAt,
			};
		});
		res.json(formattedChats);
	} catch (error) {
		res.status(500);
		next(error);
	}
}

export async function getOrCreateChat(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const userId = req.userId;
		const { participantId } = req.params;

		let chat = await Chat.findOne({
			participants: { $all: [userId, participantId] },
		})
			.populate("participants", "name email avatar")
			.populate("lastMessage");

		if (!chat) {
			const NewChat = new Chat({
				participants: [userId, participantId],
			});
			await NewChat.save();
			chat = await NewChat.populate("participants", "name email avatar");
		}
		const otherParticipant = chat.participants.find(
			(p) => p._id.toString() !== userId,
		);
		res.json({
			_id: chat._id,
			participants: otherParticipant ? otherParticipant : [],
			lastMessage: chat.lastMessage,
			lastMessageAt: chat.lastMessageAt,
			createdAt: chat.createdAt,
		});
	} catch (error) {
		res.status(500);
		next(error);
	}
}
