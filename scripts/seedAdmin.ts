import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from 'lib/mongodb';

const USERNAME = 'admin13579';
const PASSWORD = 'admin13579';

async function seedAdmin() {
    await connectDB();

    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not connected');

    const collection = db.collection('admins');

    await collection.deleteMany({});
    console.log('Cleared admins collection');

    const hashedPassword = await bcrypt.hash(PASSWORD, 10);
    await collection.insertOne({
        username: USERNAME,
        passwordHash: hashedPassword,
    });

    console.log('Admin created successfully');
    process.exit(0);
}

seedAdmin().catch((err) => {
    console.error(err);
    process.exit(1);
});