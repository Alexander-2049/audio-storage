"use client";
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import "./styles.css";
import { Input } from "../ui/input";
import { useFormState } from "react-dom";
import { signInUser } from "@/app/actions";
const initialState = {
  message: "",
};

const LoginButton = () => {
  const [state, formAction] = useFormState(signInUser, initialState);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant={"outline"}>Sign In</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-30 fixed inset-0" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <form action={formAction}>
            <Dialog.Title className="text-mauve12 m-0 mb-5 text-[17px] font-medium">
              Sign In
            </Dialog.Title>
            <label htmlFor="username">Email or username</label>
            <Input
              name="username"
              id="username"
              placeholder="Email or username"
              type="text"
              required
            />
            <label htmlFor="password">Password</label>
            <Input
              name="password"
              id="password"
              placeholder="Password"
              type="password"
              required
            />
            {state?.message && (
              <span className="text-red-600">{state.message}</span>
            )}
            <div className="mt-[25px] flex justify-end">
              <Button type="submit">Sign In</Button>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoginButton;
