import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHero extends Document {
    backgroundImage: string;
    backgroundImagePublicId: string;
    headline: string;
    subheading: string;
    buttonText: string;
    buttonLink: string;
    overlayOpacity: number;
    updatedAt: Date;
}

const HeroSchema = new Schema<IHero>(
    {
        backgroundImage:        { type: String, default: '' },
        backgroundImagePublicId:{ type: String, default: '' },
        headline:               { type: String, default: '' },
        subheading:             { type: String, default: '' },
        buttonText:             { type: String, default: '' },
        buttonLink:             { type: String, default: '' },
        overlayOpacity:         { type: Number, default: 40, min: 0, max: 100 },
    },
    { timestamps: true }
);

// There will only ever be ONE hero document in the DB
const Hero: Model<IHero> =
    mongoose.models.Hero || mongoose.model<IHero>('Hero', HeroSchema);

export default Hero;