import { NextRequest } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  if (!uid) {
    return new Response(JSON.stringify({ count: 0 }), { status: 400 });
  }

  // Adjust collection path and field names to match your schema
  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("recipientId", "==", uid),
    where("read", "==", false)
  );
  const snapshot = await getDocs(q);
  return new Response(JSON.stringify({ count: snapshot.size }), {
    status: 200,
  });
}
