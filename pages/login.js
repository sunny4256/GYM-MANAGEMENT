import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to normal user dashboard after login
      router.push("/user-dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500">
      {/* Centered container for the form and image */}
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        {/* Left section: Login form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">User Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-6 border border-gray-300 rounded"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>

          {/* Admin/Trainer login options */}
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-700 font-bold mb-4">Admin or Trainer?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push("/admin-login")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Admin Login
              </button>
              <button
                onClick={() => router.push("/trainer-login")}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
              >
                Trainer Login
              </button>
            </div>
          </div>
        </div>

        {/* Right section: Image and quote */}
        <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
          <div className="text-center p-8">
            <img
              src="/image1.webp"
              alt="Gym Motivation"
              className="w-64 h-64 object-cover rounded-lg shadow-lg mb-6"
            />
            <p className="text-xl italic text-gray-700">"The only bad workout is the one that didn’t happen."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
