/* eslint-disable @typescript-eslint/no-unused-vars */
import { ForgotPasswordForm } from "@/components/front-pages/auth/ForgotPasswordForm";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border p-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
