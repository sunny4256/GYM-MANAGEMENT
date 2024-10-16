import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";

export default function TrainerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user exists in the trainers collection
      const trainerDoc = await getDoc(doc(db, "trainers", user.uid));

      if (trainerDoc.exists()) {
        // User is a trainer, redirect to trainer dashboard
        router.push("/trainer-dashboard");
      } else {
        // User exists but is not a trainer
        setError("You are not authorized as a trainer.");
        // Sign out the user since they're not a trainer
        await auth.signOut();
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-4 text-center text-yellow-600">Trainer Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Trainer Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
          >
            Login as Trainer
          </button>
        </form>
      </div>
    </div>
  );
}