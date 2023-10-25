"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import MainButton from "../components/UI_ATOMS/MainButton";
import MainInput from "../components/UI_ATOMS/MainInput";

interface AuthFormProps {
  handleSubmit: (e: FormEvent, userame: string, password: string) => void;
  
}

export default function AuthForm({ handleSubmit }: AuthFormProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="h-2/3 justify-start flex mt-20">
      <form className="items-start flex flex-col" onSubmit={(e) => handleSubmit(e, username, password)}>
        <MainInput
          type="text"
          title="Username"
          fun={setUsername}
          inputValue={username}
          style={{ marginTop: "10px" }}
        />

        <MainInput
          type="password"
          title="Password"
          fun={setPassword}
          inputValue={password}
          style={{ marginTop: "10px" }}
        />

        {/* <MainButton style={{ marginTop: "20px", backgroundColor: "#144265" }} type="submit" title="Login" /> */}
      </form>
    </div>
  );
}