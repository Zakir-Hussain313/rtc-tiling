import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAboutImage {
    id: number;
    label: string;
    url: string;
    publicId: string;
}

export interface IAbout extends Document {
    images: IAboutImage[];
    updatedAt: Date;
}

const AboutImageSchema = new Schema<IAboutImage>(
    {
        id:       { type: Number, required: true },
        label:    { type: String, required: true },
        url:      { type: String, default: '' },
        publicId: { type: String, default: '' },
    },
    { _id: false }
);

const AboutSchema = new Schema<IAbout>(
    {
        images: {
            type: [AboutImageSchema],
            default: [
                { id: 1, label: 'Image 1', url: '', publicId: '' },
                { id: 2, label: 'Image 2', url: '', publicId: '' },
                { id: 3, label: 'Image 3', url: '', publicId: '' },
                { id: 4, label: 'Image 4', url: '', publicId: '' },
            ],
        },
    },
    { timestamps: true }
);

// There will only ever be ONE about document in the DB
const About: Model<IAbout> =
    mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);

export default About;