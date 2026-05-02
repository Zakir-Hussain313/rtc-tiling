import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
    name: string;
    role: string;
    review: string;
    rating: number;
    image: string;
    imagePublicId: string;
    approved: boolean;
    order: number;
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        name: { type: String, required: true },
        role: { type: String, default: 'Google Review' },
        review: { type: String, required: true },
        rating: { type: Number, default: 5, min: 1, max: 5 },
        image: { type: String, default: '' },
        imagePublicId: { type: String, default: '' },
        approved: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Testimonial ||
    mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);