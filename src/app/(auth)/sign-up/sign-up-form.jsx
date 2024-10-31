"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderButton } from "@/components/loader-button";
import { Terminal } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useServerAction } from "zsa-react";
import { signUpAction } from "./action";
import useActionWrapper from "@/lib/action-wrapper";
import Link from "next/link";

const signUpSchema = (phone = true) => {
  const identifier = !phone
    ? { email: z.string().email() }
    : {
        phone: z.string().refine(
          (value) => {
            const regexPatterns = [
              /^09\d{8}$/, // Starts with 09 and length 10
              /^07\d{8}$/, // Starts with 07 and length 10
              /^\+2519\d{8}$/, // Starts with +2519 and length 13
              /^\+2517\d{8}$/, // Starts with +2517 and length 13
              /^2519\d{8}$/, // Starts with 2519 and length 12
              /^2517\d{8}$/, // Starts with 2517 and length 12
            ];
            return regexPatterns.some((regex) => regex.test(value));
          },
          {
            message: "Phone number must contain only digits or start with '+'.",
          }
        ),
      };
  return z
    .object({
      ...identifier,
      name: z.union([
        z.string().min(3, { messga: "Too short" }),
        z.string().length(0),
      ]),
      password: z
        .string()
        .min(6, "Too short")
        .refine((value) => /[A-Z]/.test(value), {
          message: "Password must contain at least one uppercase letter.",
        })
        .refine((value) => /[a-z]/.test(value), {
          message: "Password must contain at least one lowercase letter.",
        })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
          message: "Password must contain at least one special character.",
        }),
      passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords don't match",
      path: ["passwordConfirm"],
    });
};

export default function SignUpForm() {
  const [phoneMode, setPhoneMode] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const callBackUrl = searchParams.get("callBackUrl");

  const { execute, isPending, error } = useActionWrapper(signUpAction);

  const form = useForm({
    resolver: zodResolver(signUpSchema(phoneMode)),
    defaultValues: {
      // password: "Aa1234!",
      // passwordConfirm: "Aa1234!",
      // name: "ousa",
      // email: "user2@test.com",
    },
  });

  const onSubmit = async (values) => {
    await execute(values);
    if (!error) {
      router.push(
        `/sign-in?callbackUrl=${callBackUrl ? callBackUrl : "/cart"}`
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="basis w-80 shrink">
        <h1 className="mb-2 header text-2xl text-center">Sign up</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {phoneMode ? (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setPhoneMode(false)}
                    >
                      Use email instead
                    </Button>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your phone"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setPhoneMode(true)}
                    >
                      Use phone number instead
                    </Button>

                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter your name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Oops!, we couldn&apos;t sign you up</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <LoaderButton
              className="w-full mt-4"
              type="submit"
              isLoading={isPending}
            >
              Sign up
            </LoaderButton>
          </form>
        </Form>
        <div className="text-center py-2">
          <Button variant="link" onClick={() => signIn("google")}>
            Sign up with Google
          </Button>
          <Button
            variant="link"
            className="text-foreground hover:no-underline group"
          >
            <Link
              href={`/sign-in?callbackUrl=${callBackUrl ? callBackUrl : "/"}`}
            >
              Have account?{" "}
              <span className="group-hover:underline text-primary">
                Sign in
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
