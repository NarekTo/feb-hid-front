"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainInput from "../../components/UI_ATOMS/MainInput";
import MainButton from "../../components/UI_ATOMS/MainButton";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const handleResetPassword = async (
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/password-reset/reset?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId, newPassword: password }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Invalid password reset token");
        } else {
          throw new Error("Failed to reset password");
        }
      }

      setMessage("Your password was reset!");
      // Redirect to login page
      // router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleResetPassword(password, confirmPassword);
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Redirect after 2 seconds
    }
  }, [message, router]);

  return (
    <div className="h-full flex items-start pt-28 justify-center w-screen ">
      <form
        onSubmit={handleSubmit}
        className="items-center flex flex-col gap-4"
      >
        <MainInput
          type="text"
          title="User Id"
          fun={setUserId}
          inputValue={userId}
          style={{ marginTop: "20px" }}
        />

        <label className="flex flex-col text-blue-800">
          <span>New Password:</span>
          <input
            className="rounded text-blue-800 border border-blue-800"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </label>
        <label className="flex flex-col text-blue-800">
          <span>Confirm New Password:</span>
          <input
            className="rounded text-blue-800 border border-blue-800"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          />
        </label>
        <MainButton
          style={{ marginTop: "20px", backgroundColor: "#144265" }}
          type="submit"
          title="Reset Password"
        />

        {error && <p>{error}</p>}
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
