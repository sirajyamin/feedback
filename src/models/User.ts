import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Message interface extending mongoose Document
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

// Create the Message schema
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: [true, 'Message content is required']
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Define the User interface extending mongoose Document
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    messages: Message[];
    isAccepting: boolean;
}

// Create the User schema
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verification code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: true,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true,
    },
    messages: [MessageSchema],
    isAccepting: {
        type: Boolean,
        default: true,
        required: true,
    },
});

// Create and export the User model
const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
