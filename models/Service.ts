import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
    title: string;
    description: string;
    image: string;
    imagePublicId: string;
    slug: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
    {
        title:          { type: String, required: true, trim: true },
        description:    { type: String, default: '', trim: true },
        image:          { type: String, default: '' },
        imagePublicId:  { type: String, default: '' },
        slug:           { type: String, required: true, unique: true, trim: true },
        order:          { type: Number, default: 0 },
    },
    { timestamps: true }
);

ServiceSchema.index({ slug: 1 });

const Service: Model<IService> =
    mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;