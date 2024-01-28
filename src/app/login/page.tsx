"use client";
import API from "@/utils/API";
import { setCookie } from "@/utils/cookies";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // TODO: Add fields validation
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function onSubmit(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const url = "/api/auth/login";
      const response = await API.POST(url, { username, password });
      const responseData = await response.json();
      if (responseData.token) {
        const daysDuration = 45;
        setCookie("token", responseData.token, daysDuration);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
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
          disabled={isLoading || errors.length > 0}
          type="submit"
          value="Submit"
          onClick={onSubmit}
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
    </div>
  );
};

export default Login;
