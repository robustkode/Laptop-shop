"use server";
import { afterLoginUrl } from "@/config";
import {
  getCustomerByEmail,
  getCustomerByPhone,
  getUserByEmail,
  getUserByPhone,
} from "@/data-access/users";
import { rateLimitByKey } from "@/lib/limiter";
import { handleError } from "@/lib/utils";
import { signUpUseCase } from "@/use-access/users";
import { config } from "dotenv";
import { redirect } from "next/navigation";
import { z } from "zod";
config();

export const signUpAction = async (input) => {
  const identifier = input.phone
    ? {
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
      }
    : { email: z.string().email() };

  const schema = z
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

  try {
    const data = schema.parse(input);
    await rateLimitByKey({
      key: input.phone ? input.phone : input.email,
      limit: 3,
      window: 10000,
    });
    if (input.phone) {
      await signUpUseCase({
        getUser: getUserByPhone,
        input: { ...data, phoneNumber: data.phone },
        identifier: input.phone,
        message: "phone number",
      });
    } else {
      await signUpUseCase({
        getUser: getUserByEmail,
        input: data,
        identifier: input.email,
        message: "email",
      });
    }

    // return { success: { data: null } };
  } catch (error) {
    return handleError(error);
    // return { error: { message: err.message, code: err.code } };
  }
  redirect("/sign-in");
};
