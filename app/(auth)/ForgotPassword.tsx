import React, { useState, ChangeEvent, FormEvent } from "react";
import MainButton from "../components/UI_ATOMS/MainButton";
import MainInput from "../components/UI_ATOMS/MainInput";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const handleForgotPassword = async (email: string, userId: string) => {
    try {
      const response = await fetch("http://localhost:3000/password-reset/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userId }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        } else {
          throw new Error("Failed to send password reset email");
        }
      }

      // Redirect or provide further instructions here
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleForgotPassword(email, userId);
  };

  return (
    <div className="h-1/3 justify-center items-center  ">
      <p className="text-blue-800">Forgot Password?</p>
      <form onSubmit={handleSubmit} className="justify-start items-start flex flex-col">
        <MainInput
          type="text"
          title="User Id"
          fun={setUserId}
          inputValue={userId}
          style={{ marginTop: "10px" }}
        />
        <MainInput
          type="email"
          title="Email"
          fun={setEmail}
          inputValue={email}
          style={{ marginTop: "10px" }}
        />

        <MainButton type="submit" title="Reset password" style={{ marginTop: "20px", backgroundColor: "#144265" }} fun={function (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
          throw new Error("Function not implemented.");
        } } />

        {error && <p>{error}</p>}
        {message && (
  <>
    {message &&
      message.split('.').map((sentence, index) => (
        sentence.trim() !== '' && <p key={index} className="text-sm mt-2 text-slate-400">{sentence.trim()}.</p>
      ))
    }
  </>
)}
      </form>
    </div>
  );
}
