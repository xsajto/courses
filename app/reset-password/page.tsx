"use client";

import { useState } from "react";
import { resetPassword } from "@/app/actions/auth";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.append("token", token || "");
    
    try {
      await resetPassword(formData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  if (!token) {
    return <p className="form-error">Invalid reset link.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="password"
        type="password"
        placeholder="NEW PASSWORD"
        className="form-input"
        required
      />
      
      {error && <p className="form-error">{error}</p>}
      
      <button
        type="submit"
        className="primary-btn w-full mt-4"
      >
        Reset Password
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] text-center">
        <h1 className="text-3xl font-black text-duo-text mb-8">Set new password</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
