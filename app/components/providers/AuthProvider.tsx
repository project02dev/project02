/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

/**
 * Ensures the authenticated user's Firestore document exists at /users/{uid}
 * and performs a one-time migration if there is an older user doc keyed by a non-UID id.
 * Migration strategy:
 * - Find any docs in /users where email == currentUser.email and doc.id !== currentUser.uid
 * - Merge data into the canonical /users/{uid} doc
 * - Delete the old mismatched doc to avoid duplicates
 */
async function ensureUserDocAndMigrate(
  uid: string,
  email: string | null,
  profile: {
    displayName: string | null;
    photoURL: string | null;
    provider: string | undefined;
  }
) {
  // Always upsert the canonical user doc first
  const baseData: Record<string, unknown> = {
    email: email,
    displayName: profile.displayName,
    photoURL: profile.photoURL,
    provider: profile.provider,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, "users", uid), baseData, { merge: true });

  // If we don't have an email, we cannot safely migrate by email
  if (!email) return;

  // Find any legacy docs keyed by non-UID where email matches
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snap = await getDocs(q);

  for (const legacy of snap.docs) {
    if (legacy.id === uid) continue; // already the canonical doc

    // Merge legacy data into canonical doc
    const legacyData = legacy.data();
    await setDoc(
      doc(db, "users", uid),
      {
        ...legacyData,
        // canonical fields take precedence
        email,
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        provider: profile.provider,
        migratedFromDocId: legacy.id,
        migratedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Remove the legacy document to prevent duplicates
    await deleteDoc(doc(db, "users", legacy.id));
  }
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await ensureUserDocAndMigrate(user.uid, user.email, {
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: user.providerData?.[0]?.providerId,
          });
        }
      } catch (e) {
        // Non-fatal: UI should not crash if migration fails
        console.error("User ensure/migration error:", e);
      }
    });

    setMounted(true);

    return () => unsubscribe();
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
