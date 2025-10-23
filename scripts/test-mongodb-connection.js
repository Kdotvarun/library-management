const mongoose = require('mongoose');

// Test MongoDB Atlas connection
async function testConnection() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    console.log('Please set MONGODB_URI in your .env.local file');
    process.exit(1);
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    console.log('Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in output
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check your username and password');
      console.log('2. Ensure the database user has proper permissions');
      console.log('3. Verify the connection string format');
    } else if (error.message.includes('network')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check your IP address is whitelisted');
      console.log('2. Ensure "Allow Access from Anywhere" is enabled');
      console.log('3. Check your internet connection');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
}

testConnection();
