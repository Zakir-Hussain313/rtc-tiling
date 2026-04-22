import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
    title: string;
    description: string;
    image: string;
    imagePublicId: string;
    serviceType: string;
    location: string;
    estimatedDuration: string;
    maximumArea: string;
    finishStyle: string;
    suitableFor: string;
    slug: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
    {
        title:             { type: String, required: true, trim: true },
        description:       { type: String, default: '', trim: true },
        image:             { type: String, default: '' },
        imagePublicId:     { type: String, default: '' },
        serviceType:       { type: String, default: '', trim: true },
        location:          { type: String, default: '', trim: true },
        estimatedDuration: { type: String, default: '', trim: true },
        maximumArea:       { type: String, default: '', trim: true },
        finishStyle:       { type: String, default: '', trim: true },
        suitableFor:       { type: String, default: '', trim: true },
        slug:              { type: String, required: true, unique: true, trim: true },
        order:             { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Service: Model<IService> =
    mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;