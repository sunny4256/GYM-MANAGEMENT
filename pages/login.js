import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "../utils/firebaseAuth";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      router.push("/user-dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
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
          <Button onClick={handleLogin} className="w-full bg-blue-500 hover:bg-blue-600">
            Login
          </Button>

          <div className="mt-6 text-center">
            <p className="text-lg text-gray-700 font-bold mb-4">Admin or Trainer?</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => router.push("/admin-login")} className="bg-red-500 hover:bg-red-600">
                Admin Login
              </Button>
              <Button onClick={() => router.push("/trainer-login")} className="bg-yellow-500 hover:bg-yellow-600">
                Trainer Login
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
          <div className="text-center p-8">
            <img
              src="/image1.webp"
              alt="Gym Motivation"
              className="w-64 h-64 object-cover rounded-lg shadow-lg mb-6"
            />
            <p className="text-xl italic text-gray-700">"The only bad workout is the one that didn't happen."</p>
          </div>
        </div>
      </div>
    </div>
  );
}