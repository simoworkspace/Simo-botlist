import { Schema, model } from "mongoose";
import type { UserStructure } from "../types";

const rawUserSchema = new Schema<UserStructure>({
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
	  bio: {
			type: String,
			required: false,
				default: ""
		},
	  team: {
        id: String,
        name: String,
        avatar_url: String,
        description: String,
        bot_id: String,
        members: [
            {
                id: String,
                permission: Number,
                owner: Boolean,
            },
        ],
    },
    notifications: {
        type: Map,
        of: Object,
        default: new Map(), 
    },
});

export const userSchema = model("User", rawUserSchema);