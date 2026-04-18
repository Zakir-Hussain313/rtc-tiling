import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    image: string;
    imagePublicId: string;
    day: string;
    month: string;
    year: string;
    slug: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title:          { type: String, required: true, trim: true },
        description:    { type: String, default: '', trim: true },
        image:          { type: String, default: '' },
        imagePublicId:  { type: String, default: '' },
        day:            { type: String, default: '' },
        month:          { type: String, default: '' },
        year:           { type: String, default: '' },
        slug:           { type: String, required: true, unique: true, trim: true },
        order:          { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Index slug for fast lookups on the public frontend
ProjectSchema.index({ slug: 1 });

const Project: Model<IProject> =
    mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;