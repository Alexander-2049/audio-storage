"use client";

import { useState } from "react";

interface Props {
  onSubmit(username: string, password: string): void;
  errors: string[];
  isLoading: boolean;
}

const LoginForm = ({ onSubmit, errors, isLoading }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <form>
        <label>
          <b>Username</b>
          <input
            type="text"
            placeholder="Enter Username"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.currentTarget.value);
            }}
          />
        </label>
        <label>
          <b>Password</b>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
          />
        </label>
        <input
          disabled={isLoading}
          type="submit"
          value="Submit"
          onClick={(e) => {
            e.preventDefault();
            onSubmit(username, password);
          }}
        />
      </form>
      {errors.length > 0 ? (
        <ul>
          {errors.map((err, index) => {
            return <li key={`AuthError${index}`}>{err}</li>;
          })}
        </ul>
      ) : (
        ""
      )}
    </>
  );
};

export default LoginForm;
