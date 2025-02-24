import { Schema, Document, Types, model } from 'mongoose';

export interface IToken extends Document {
    token: string;
    user: Types.ObjectId;
    createdAt: Date;
}

const tokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: '10m',
    },
});

export const Token = model<IToken>('Token', tokenSchema);
