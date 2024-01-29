"use client";

import { useFormState } from "react-dom";
import { signInUser } from "@/app/actions";
const initialState = {
  message: "",
};

export function Signin() {
  const [state, formAction] = useFormState(signInUser, initialState);

  return (
    <form action={formAction} className="flex flex-col max-w-3xl border-2 border-slate-100 rounded-lg *:border-2">
      <label htmlFor="username">Email</label>
      <input type="text" id="username" name="username" required />
      
      <label htmlFor="password">Password</label>
      <input type="text" id="password" name="password" required />

      <p aria-live="polite">{state?.message}</p>
      <input type="submit" value="Sign In"/>
    </form>
  );
}
