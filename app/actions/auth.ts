"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { resend } from "@/lib/resend";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  redirect("/login");
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email is required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // We don't want to leak if a user exists or not
    return { success: true };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpires = new Date(Date.now() + 3600000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetExpires,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: "Typing Game <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });
  } catch (error) {
    console.error("Failed to send email", error);
    throw new Error("Failed to send email");
  }

  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) {
    throw new Error("Missing information");
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetExpires: null,
    },
  });

  redirect("/login");
}
