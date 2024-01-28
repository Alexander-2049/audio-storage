"use client";
import API from "@/utils/API";
import { setCookie } from "@/utils/cookies";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  // TODO: Add fields validation
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function onSubmit(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const url = "/api/auth/register";
      const response = await API.POST(url, { username, password });
      const responseData = await response.json();
      if (responseData.success) {
        router.push("/login?reg="+responseData.username);
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
        <label>
          <b>Password repeat</b>
          <input
            type="password2"
            placeholder="Repeat Password"
            name="password2"
            value={password2}
            onChange={(e) => {
              setPassword2(e.currentTarget.value);
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

export default Register;
