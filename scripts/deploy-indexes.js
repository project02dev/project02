#!/usr/bin/env node

/**
 * Script to deploy Firestore indexes
 * 
 * This script helps deploy the required Firestore indexes for the messaging system
 * and other complex queries in the application.
 * 
 * Usage:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login to Firebase: firebase login
 * 3. Run this script: node scripts/deploy-indexes.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Deploying Firestore indexes...');

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Firebase CLI is not installed. Please install it first:');
  console.error('npm install -g firebase-tools');
  process.exit(1);
}

// Check if firebase.json exists
const firebaseConfigPath = path.join(process.cwd(), 'firebase.json');
if (!fs.existsSync(firebaseConfigPath)) {
  console.error('❌ firebase.json not found. Please make sure you are in the project root.');
  process.exit(1);
}

// Check if firestore.indexes.json exists
const indexesPath = path.join(process.cwd(), 'firestore.indexes.json');
if (!fs.existsSync(indexesPath)) {
  console.error('❌ firestore.indexes.json not found.');
  process.exit(1);
}

try {
  console.log('📋 Deploying Firestore indexes...');
  execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
  
  console.log('✅ Firestore indexes deployed successfully!');
  console.log('');
  console.log('📝 Note: Index creation can take several minutes to complete.');
  console.log('   You can monitor the progress in the Firebase Console:');
  console.log('   https://console.firebase.google.com/project/project-02-f569f/firestore/indexes');
  console.log('');
  console.log('🔄 The messaging system will work properly once the indexes are built.');
  
} catch (error) {
  console.error('❌ Failed to deploy indexes:', error.message);
  console.log('');
  console.log('💡 Alternative: You can create indexes manually by clicking the links in the error messages.');
  process.exit(1);
}
