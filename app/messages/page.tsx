"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import MessageCenter from "@/components/messaging/MessageCenter";
import Header from "@/components/Header";
import SystemStatus from "@/components/ui/SystemStatus";

export default function MessagesPage() {
  const [user, loading] = useAuthState(auth);
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUserId = searchParams.get("user");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <MessageCenter
            targetUserId={targetUserId ?? undefined}
            isFullPage={true}
          />
        </div>
      </div>
      <SystemStatus />
    </div>
  );
}
