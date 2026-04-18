import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStat {
    id: number;
    value: string;
    suffix: '+' | '%';
    label: string;
}

export interface IStats extends Document {
    stats: IStat[];
    updatedAt: Date;
}

const StatItemSchema = new Schema<IStat>(
    {
        id:     { type: Number, required: true },
        value:  { type: String, required: true, trim: true },
        suffix: { type: String, enum: ['+', '%'], required: true },
        label:  { type: String, required: true, trim: true },
    },
    { _id: false }
);

const StatsSchema = new Schema<IStats>(
    {
        stats: {
            type: [StatItemSchema],
            default: [
                { id: 1, value: '99',  suffix: '+', label: 'Projects Completed'  },
                { id: 2, value: '10',  suffix: '+', label: 'Team Members'        },
                { id: 3, value: '92',  suffix: '%', label: 'Client Retention'    },
                { id: 4, value: '80',  suffix: '+', label: 'Successful Launches' },
            ],
        },
    },
    { timestamps: true }
);

// There will only ever be ONE stats document in the DB
const Stats: Model<IStats> =
    mongoose.models.Stats || mongoose.model<IStats>('Stats', StatsSchema);

export default Stats;