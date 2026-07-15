import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhIpwGPEmJ9thOZAzNNlLYIKtLHevoCNE",
  authDomain: "life-horizon-e8299.firebaseapp.com",
  projectId: "life-horizon-e8299",
  storageBucket: "life-horizon-e8299.firebasestorage.app",
  messagingSenderId: "621905918450",
  appId: "1:621905918450:web:7b6770a22df562d067536b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper function to save a rating
export async function saveRating(rating: number, name?: string) {
  try {
    const ratingsRef = collection(db, "ratings");
    await addDoc(ratingsRef, {
      rating,
      name: name || "Anoniem",
      createdAt: serverTimestamp(),
    });
    console.log("Rating successfully saved to Firestore");
  } catch (error) {
    console.error("Error saving rating to Firestore: ", error);
  }
}
