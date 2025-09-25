/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function fetchRatings(projectId: string) {
  const q = query(
    collection(db, "ratings"),
    where("project_Id", "==", projectId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addRating({
  project_Id,
  project_creator_id,
  rated_by,
  review,
  star,
}: any) {
  await addDoc(collection(db, "ratings"), {
    project_Id,
    project_creator_id,
    rated_by,
    review,
    star,
    date: serverTimestamp(),
  });
}
