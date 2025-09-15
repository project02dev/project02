#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 Deploying Firestore rules...");

try {
  // Check if Firebase CLI is installed
  try {
    execSync("firebase --version", { stdio: "pipe" });
  } catch (error) {
    console.error("❌ Firebase CLI is not installed. Please install it with:");
    console.log("npm install -g firebase-tools");
    console.log("firebase login");
    process.exit(1);
  }

  // Check if user is logged in
  try {
    execSync("firebase projects:list", { stdio: "pipe" });
  } catch (error) {
    console.error("❌ Please login to Firebase first:");
    console.log("firebase login");
    process.exit(1);
  }

  // Deploy Firestore rules
  console.log("📦 Deploying Firestore rules...");
  execSync("firebase deploy --only firestore:rules", {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  console.log("✅ Firestore rules deployed successfully!");
  console.log("");
  console.log("📋 Next steps:");
  console.log("1. Test the like functionality on your production site");
  console.log(
    "2. Verify that users can like/unlike projects without permission errors"
  );
  console.log("3. Check that public users can view project likes count");
} catch (error) {
  console.error("❌ Error deploying Firestore rules:", error.message);
  process.exit(1);
}
