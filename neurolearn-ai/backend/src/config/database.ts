import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neurolearn';

  mongoose.set('strictQuery', false);

  // Try connecting to the configured MongoDB
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`\n✅ MongoDB Connected: ${mongoose.connection.host}\n`);
    return;
  } catch (err: any) {
    console.warn(`\n⚠️  Could not connect to MongoDB at: ${uri.replace(/\/\/.*@/, '//***@')}`);
    console.warn(`   Error: ${err.message}\n`);
  }

  // Fallback: Use in-memory MongoDB (works without installing anything!)
  try {
    console.log('🔄 Starting in-memory MongoDB (no install needed)...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log(`✅ In-memory MongoDB started successfully!`);
    console.log(`   ⚠️  Data will be lost when server restarts.`);
    console.log(`   💡 For persistent data, install MongoDB or use Atlas.\n`);
    return;
  } catch (memErr: any) {
    console.error('\n❌ Could not start in-memory MongoDB either.');
    console.error(`   Error: ${memErr.message}`);
    console.error('\n📋 To fix this, do ONE of these:');
    console.error('   1. Install MongoDB: https://www.mongodb.com/try/download/community');
    console.error('   2. Use Atlas (free cloud): https://cloud.mongodb.com');
    console.error('   3. Docker: docker run -d -p 27017:27017 --name mongo mongo:7\n');
    // Still don't crash — let the server start with the DB-check middleware
  }
};

export default connectDB;
