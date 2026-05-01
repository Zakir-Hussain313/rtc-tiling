import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from 'lib/mongodb';

async function seedAdmin() {
    await connectDB();

    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not connected');

    const collection = db.collection('admins');

    const existing = await collection.findOne({ username: 'admin1234' });
    if (existing) {
        console.log('Admin already exists');
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin1357', 10);
    await collection.insertOne({
        username: 'admin1357',
        password: hashedPassword,
    });

    console.log('Admin created successfully');
    process.exit(0);
}

seedAdmin().catch((err) => {
    console.error(err);
    process.exit(1);
});