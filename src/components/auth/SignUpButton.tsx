"use client";
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import "./styles.css";
import { Input } from "../ui/input";
import { useFormState } from "react-dom";
import { createUser } from "@/app/actions";
const initialState = {
  message: "",
  success: false,
};

const SignUpButton = () => {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant={"default"}>Create Account</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-30 fixed inset-0" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <form action={formAction}>
            <Dialog.Title className="text-mauve12 m-0 mb-5 text-[17px] font-medium">
              Create Account
            </Dialog.Title>
            <label htmlFor="email">Email</label>
            <Input
              name="email"
              id="email"
              placeholder="Email"
              type="email"
              required
              className="mb-3"
            />
            <label htmlFor="username">Username</label>
            <Input
              name="username"
              id="username"
              placeholder="Username"
              type="text"
              required
              className="mb-3"
            />
            <label htmlFor="password">Password</label>
            <Input
              name="password"
              id="password"
              placeholder="Password"
              type="password"
              required
              className="mb-3"
            />
            <label htmlFor="password_repeat">Password repeat</label>
            <Input
              name="password_repeat"
              id="password_repeat"
              placeholder="Password"
              type="password"
              required
              className="mb-3"
            />
            {state?.message && !state?.success && (
              <span className="text-red-600">{state.message}</span>
            )}
            {state?.message && state?.success && (
              <>
                <span className="text-green-600 block">{state.message}</span>
                <span className="block">
                  Click <strong>Sign In</strong> to get into your account
                </span>
              </>
            )}
            <div className="mt-[25px] flex justify-end">
              <Button type="submit">Create Account</Button>
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

export default SignUpButton;
