"use client";

import { useFormState } from "react-dom";
import { createUser } from "@/app/actions";
const initialState = {
  message: "",
};

export function Signup() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction} className="flex flex-col max-w-3xl border-2 border-slate-100 rounded-lg *:border-2">
      <label htmlFor="username">Email</label>
      <input type="text" id="username" name="username" required />
      
      <label htmlFor="password">Password</label>
      <input type="text" id="password" name="password" required />

      <label htmlFor="password_repeat">Password Repeat</label>
      <input type="text" id="password_repeat" name="password_repeat" required />
      <p aria-live="polite">{state?.message}</p>
      <input type="submit" value="Sign Up"/>
    </form>
  );
}
