import { ResetPasswordForm } from "@/components/front-pages/auth/ResetPasswordForm";
import Image from "next/image";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
