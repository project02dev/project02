/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, db } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
  getRedirectResult,
  UserCredential,
  AuthError,
  User,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface AuthResponse {
  uid: any;
  email: any;
  displayName: any;
  photoURL: any;
  user: User;
  isNewUser: boolean;
}

function isAuthError(error: unknown): error is AuthError {
  return (error as AuthError)?.code !== undefined;
}

function handleAuthError(error: unknown): Error {
  if (isAuthError(error)) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return new Error("This email is already registered");
      case "auth/popup-blocked":
        return new Error("Popup was blocked by your browser");
      case "auth/popup-closed-by-user":
        return new Error(
          "Please complete the authentication process to continue"
        );
      case "auth/cancelled-popup-request":
        return new Error("Authentication process was interrupted");
      case "auth/user-cancelled":
        return new Error("Authentication was cancelled by user");
      case "auth/invalid-email":
        return new Error("Invalid email address");
      default:
        return new Error(error.message);
    }
  }
  return new Error("Authentication failed. Please try again.");
}

export async function signUpWithEmailPassword(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName,
    });

    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
}

async function handleOAuthSignIn(
  provider: GoogleAuthProvider | GithubAuthProvider
): Promise<AuthResponse> {
  try {
    // Add persistence
    await auth.setPersistence(browserLocalPersistence);

    const result = await signInWithPopup(auth, provider);

    if (!result.user) {
      throw new Error("No user data received");
    }

    // Ensure user document exists at /users/{uid} (merge to avoid overwrites)
    const isNewUser = (result as any)._tokenResponse?.isNewUser ?? false;
    const providerId = provider.providerId;
    const baseData: Record<string, unknown> = {
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      provider: providerId,
      updatedAt: new Date().toISOString(),
    };
    if (isNewUser) {
      baseData.createdAt = new Date().toISOString();
    }
    await setDoc(doc(db, "users", result.user.uid), baseData, { merge: true });

    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      user: result.user,
      isNewUser,
    };
  } catch (error) {
    if (isAuthError(error) && error.code === "auth/popup-blocked") {
      try {
        await signInWithRedirect(auth, provider);
        const result = await getRedirectResult(auth);

        if (!result?.user) {
          throw new Error("Authentication failed");
        }

        // Ensure user document exists at /users/{uid} (merge to avoid overwrites)
        const isNewUser = (result as any)._tokenResponse?.isNewUser ?? false;
        const providerId = provider.providerId;
        const baseData: Record<string, unknown> = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          provider: providerId,
          updatedAt: new Date().toISOString(),
        };
        if (isNewUser) {
          baseData.createdAt = new Date().toISOString();
        }
        await setDoc(doc(db, "users", result.user.uid), baseData, {
          merge: true,
        });

        return {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          user: result.user,
          isNewUser,
        };
      } catch (redirectError) {
        throw handleAuthError(redirectError);
      }
    }
    throw handleAuthError(error);
  }
}

export async function signInWithGoogle(): Promise<AuthResponse> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  return handleOAuthSignIn(provider);
}

export async function signInWithGithub(): Promise<AuthResponse> {
  const provider = new GithubAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  return handleOAuthSignIn(provider);
}
