import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer: MongoMemoryServer | null = null;

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora';
  mongoose.set('strictQuery', false);

  // Step 1: Try the configured MongoDB
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log(`\n✅ MongoDB Connected: ${mongoose.connection.host}\n`);
    return;
  } catch {
    console.warn(`\n⚠️  Cannot connect to MongoDB at ${uri}`);
  }

  // Step 2: Auto-start in-memory MongoDB
  try {
    console.log('🔄 Starting in-memory MongoDB automatically...');
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log('✅ In-memory MongoDB running! (data resets on restart)\n');
  } catch (e: any) {
    console.error('❌ [DatabaseConfig] Failed to start in-memory MongoDB:', e.message);
    console.error('   Install MongoDB or use Atlas: https://cloud.mongodb.com\n');
    throw new Error(`Database connection failed: ${e.message}`);
  }
};

export default connectDB;
