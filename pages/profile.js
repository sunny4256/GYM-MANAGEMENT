import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setEmail(userData.email);
          setName(userData.name || ""); // Fallback if no name is set
        }

        setLoading(false);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          name: name,
        });
        setMessage("Profile updated successfully.");
      } catch (error) {
        setMessage("Error updating profile: " + error.message);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl mb-4">Profile Page</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <div className="w-80 bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full p-2 mb-3 border rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
          />
        </div>
        <button
          onClick={handleUpdateProfile}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
