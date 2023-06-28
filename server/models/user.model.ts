import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
    username: string;
    firstName: string;
    email: string;
    googleId?: string;
    appleId?: string;
    lastName: string;
    authType: AuthType;
    password?: string;
}

type AuthType = "local" | "google" | "apple";

const UserSchema = new Schema<User>({
    username: String,
    firstName: String,
    email: String,
    lastName: String,
    authType: String,
    password: {
        type: String,
        required: function(this: User) {
            return this.authType === 'local';
        }
    }
});

const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;