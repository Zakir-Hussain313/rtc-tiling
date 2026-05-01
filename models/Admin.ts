import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
    username: string;
    passwordHash: string;
}

const AdminSchema = new Schema<IAdmin>({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
});

const Admin: Model<IAdmin> =
    mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;