"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] text-center">
        <h1 className="text-3xl font-black text-duo-text mb-8">Login</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
          
          {error && <p className="form-error">{error}</p>}
          
          <button
            type="submit"
            className="primary-btn w-full mt-4"
          >
            Log in
          </button>
        </form>
        
        <div className="mt-8 flex flex-col gap-2">
          <Link href="/forgot-password" title="Forgot password" className="text-duo-blue font-extrabold uppercase text-sm">
            Forgot password?
          </Link>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-duo-gray-dark font-bold uppercase text-xs">Don't have an account?</span>
            <Link href="/register" title="Create account" className="text-duo-blue font-extrabold uppercase text-sm">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
