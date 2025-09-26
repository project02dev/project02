"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import MessageCenter from "@/components/messaging/MessageCenter";
import Header from "@/components/Header";

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
      <div className="h-screen flex flex-col">
        <div className="shrink-0">
          <Header />
        </div>
        <div className="min-h-0 flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Lock header height so body can own the only scroll */}
      <div className="shrink-0">
        <Header />
      </div>
      {/* One true scrolling area for the whole page (prevents page+chat double scroll) */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {/* No inner page padding that could introduce extra scroll containers */}
        <MessageCenter
          targetUserId={targetUserId ?? undefined}
          isFullPage={true}
        />
      </div>
    </div>
  );
}
