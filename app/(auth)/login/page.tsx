"use client";

import { signIn } from "next-auth/react";
import AuthForm from "../AuthForm";
import ForgotPassword from "../ForgotPassword";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [err, setErr] = useState<string>("");

  const handleSubmit = async (
    e: FormEvent,
    username: string,
    password: string
  ) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        user_id: username,
        password,
        redirect: false, // Disable automatic redirect on success
        callbackUrl: "/",
      });
      if (res && res.error) {
        setErr("Invalid Username or Password"); // Generic password-related error message
      } else {
        router.push("/");
      }
    } catch (error) {
      // Handle other errors, if needed
      setErr("An error occurred");
    }
  };

  return (
    <main className="w-screen flex flex-col justify-around items-center gap-40 ">
      <AuthForm handleSubmit={handleSubmit} />
      {err && <p>{err}</p>}
      <ForgotPassword />
    </main>
  );
}
