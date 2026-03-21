"use client";

import { useState } from "react";
import { register } from "@/app/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    
    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] text-center">
        <h1 className="text-3xl font-black text-duo-text mb-8">Create your profile</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="NAME"
            className="form-input"
          />
          <input
            name="email"
            type="email"
            placeholder="EMAIL"
            className="form-input"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="PASSWORD"
            className="form-input"
            required
          />
          
          {error && <p className="form-error">{error}</p>}
          
          <button
            type="submit"
            className="primary-btn w-full mt-4"
          >
            Create account
          </button>
        </form>
        
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="text-duo-gray-dark font-bold uppercase text-xs">Already have an account?</span>
          <Link href="/login" className="text-duo-blue font-extrabold uppercase text-sm">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
