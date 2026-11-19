import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
	sender: mongoose.Types.ObjectId;
	text: string;
	chat: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
	{
		chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
		sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
		text: { type: String, required: true, trim: true },
	},
	{ timestamps: true },
);

// indexes for efficient querying

MessageSchema.index({ chat: 1, createdAt: 1 }); // oldest one first, newest one last

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
