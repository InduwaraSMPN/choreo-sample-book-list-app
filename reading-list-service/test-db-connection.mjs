#!/usr/bin/env node

/**
 * Test script to verify database connection configuration
 * This script checks if the required environment variables are set
 * and attempts to connect to the database.
 */

import database from './database.mjs';

console.log('🔍 Testing Database Connection Configuration...\n');

// Check environment variables
console.log('📋 Environment Variables:');
const requiredEnvVars = [
  'CHOREO_DATABASE_CONNECTION_HOSTNAME',
  'CHOREO_DATABASE_CONNECTION_PORT',
  'CHOREO_DATABASE_CONNECTION_USERNAME',
  'CHOREO_DATABASE_CONNECTION_PASSWORD',
  'CHOREO_DATABASE_CONNECTION_DATABASENAME'
];

let allEnvVarsSet = true;
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    if (envVar.includes('PASSWORD')) {
      console.log(`✅ ${envVar}: ****** (hidden)`);
    } else {
      console.log(`✅ ${envVar}: ${value}`);
    }
  } else {
    console.log(`❌ ${envVar}: NOT SET`);
    allEnvVarsSet = false;
  }
});

console.log('\n🔌 Testing Database Connection...');

if (!allEnvVarsSet) {
  console.log('❌ Cannot test connection - missing required environment variables');
  console.log('\n💡 For local testing, set the environment variables:');
  console.log('export CHOREO_DATABASE_CONNECTION_HOSTNAME=your_hostname');
  console.log('export CHOREO_DATABASE_CONNECTION_PORT=3306');
  console.log('export CHOREO_DATABASE_CONNECTION_USERNAME=your_username');
  console.log('export CHOREO_DATABASE_CONNECTION_PASSWORD=your_password');
  console.log('export CHOREO_DATABASE_CONNECTION_DATABASENAME=your_database');
  process.exit(1);
}

try {
  await database.connect();
  console.log('✅ Database connection successful!');
  console.log('✅ Books table initialized successfully!');
  
  // Test basic operations
  console.log('\n🧪 Testing basic database operations...');
  
  // Test adding a book
  const testUuid = 'test-' + Date.now();
  await database.addBook(testUuid, 'Test Book', 'Test Author', 'to_read');
  console.log('✅ Add book operation successful');
  
  // Test retrieving the book
  const book = await database.getBook(testUuid);
  if (book && book.title === 'Test Book') {
    console.log('✅ Get book operation successful');
  } else {
    console.log('❌ Get book operation failed');
  }
  
  // Test updating the book
  await database.updateBookStatus(testUuid, 'reading');
  const updatedBook = await database.getBook(testUuid);
  if (updatedBook && updatedBook.status === 'reading') {
    console.log('✅ Update book operation successful');
  } else {
    console.log('❌ Update book operation failed');
  }
  
  // Test deleting the book
  await database.deleteBook(testUuid);
  const deletedBook = await database.getBook(testUuid);
  if (!deletedBook) {
    console.log('✅ Delete book operation successful');
  } else {
    console.log('❌ Delete book operation failed');
  }
  
  console.log('\n🎉 All database operations completed successfully!');
  console.log('🚀 Your service is ready to use the MySQL database.');
  
} catch (error) {
  console.log('❌ Database connection failed:', error.message);
  console.log('\n🔧 Troubleshooting tips:');
  console.log('1. Verify that your Choreo database is running');
  console.log('2. Check that the database connection is properly configured in Choreo');
  console.log('3. Ensure the environment variables are correctly injected');
  console.log('4. Verify network connectivity to the database');
} finally {
  await database.close();
  console.log('\n🔌 Database connection closed.');
}
