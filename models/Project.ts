import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    image: string;
    imagePublicId: string;
    type: string;
    location: string;
    completionYear: string;
    size: string;
    designStyle: string;
    client: string;
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
        type:           { type: String, default: '', trim: true },
        location:       { type: String, default: '', trim: true },
        completionYear: { type: String, default: '', trim: true },
        size:           { type: String, default: '', trim: true },
        designStyle:    { type: String, default: '', trim: true },
        client:         { type: String, default: '', trim: true },
        slug:           { type: String, required: true, unique: true, trim: true },
        order:          { type: Number, default: 0 },
    },
    { timestamps: true }
);

ProjectSchema.index({ slug: 1 });

const Project: Model<IProject> =
    mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;