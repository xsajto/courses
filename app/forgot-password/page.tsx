"use client";

import { useState } from "react";
import { forgotPassword } from "@/app/actions/auth";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await forgotPassword(formData);
      if (res.success) setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] text-center">
        <h1 className="text-3xl font-black text-duo-text mb-4">Forgot Password</h1>
        <p className="text-duo-gray-dark font-bold mb-8">No problem! We'll send you a link to reset it.</p>
        
        {success ? (
          <div className="form-success p-6">
            <p>Email sent! Check your inbox for the reset link.</p>
            <Link href="/login" className="primary-btn w-full mt-6 inline-block">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              placeholder="EMAIL"
              className="form-input"
              required
            />
            
            {error && <p className="form-error">{error}</p>}
            
            <button
              type="submit"
              className="primary-btn w-full mt-4"
            >
              Send link
            </button>
            
            <Link href="/login" className="text-duo-blue font-extrabold uppercase text-sm mt-4">
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
