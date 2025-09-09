/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserCredential } from "firebase/auth";

// Extend UserCredential to include _tokenResponse
interface ExtendedUserCredential extends UserCredential {
  _tokenResponse?: {
    isNewUser?: boolean;
  };
}

export type { ExtendedUserCredential };

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "student" | "creator";
  photoURL: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateUserRequest = Omit<UserData, "createdAt" | "updatedAt">;

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}
export type LoginOptionsProps = {
  onGoogleClick: () => void;
  onGithubClick: () => void;
  className?: string;
  disabled?: boolean;
};
