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
import Link from "next/link";

//! add phone sign-in
const signInSchema = (phone = true) => {
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

  return z.object({
    ...identifier,
    password: z.string().min(6, "Too short"),
  });
};
export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneMode, setPhoneMode] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema(phoneMode)),
    defaultValues: {
      // password: "Aa1234!",
      // email: "user2@test.com",
    },
  });

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const callBackPath = callbackUrl.match(/^\/.*/);
  const forwardUrl = callBackPath ? callBackPath[0] : "/";

  async function onSubmit(values) {
    setLoading(true);
    setError(false);
    //! use custome wrapper
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    router.push(forwardUrl);
  }

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="basis w-80 shrink">
        <h1 className="mb-1 header text-2xl text-center">Sign in</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {phoneMode ? (
              //! use input otp instead
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
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Oops!, we couldn&apos;t log you in</AlertTitle>

                {error === "CredentialsSignin" ? (
                  <AlertDescription>Invalide credentials!</AlertDescription>
                ) : (
                  ""
                )}
              </Alert>
            )}

            <LoaderButton
              className="w-full mt-4"
              type="submit"
              isLoading={loading}
            >
              Sign In
            </LoaderButton>
          </form>
        </Form>
        <div className="text-center py-2">
          <Button variant="link" onClick={() => signIn("google")}>
            Sign in with Google
          </Button>
        </div>
        <p className="text-center text-small">
          Don&apos;t have an account? Sign up{" "}
          <Link
            href={"/sign-up?callbackUrl=" + forwardUrl}
            className="text-primary"
          >
            Here.
          </Link>
        </p>
      </div>
    </div>
  );
}
