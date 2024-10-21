"use server";
import { afterLoginUrl } from "@/config";
import { getUserByEmail, getUserByPhone } from "@/data-access/users";
import { rateLimitByKey } from "@/lib/limiter";
import { handleError } from "@/lib/utils";
import { signInUseCase } from "@/use-access/users";
import { config } from "dotenv";
import { redirect } from "next/navigation";
import { z } from "zod";
config();

export const signInAction = async (input) => {
  const schema = input.email
    ? z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    : z.object({
        //! change this schema
        phone: z.string(),
        password: z.string().min(6),
      });

  try {
    const data = schema.parse(input);
    await rateLimitByKey({
      key: input.email ? input.email : input.phone,
      limit: 3,
      window: 10000,
    });
    let user = null;
    if (input.email) {
      user = await signInUseCase({
        getUser: getUserByEmail,
        identifier: input.email,
        input: data,
      });
    } else {
      user = await signInUseCase({
        getUser: getUserByPhone,
        identifier: input.phone,
        input: data,
      });
    }
    return user;
  } catch (error) {
    const err = handleError(error);
    console.log("errori", err);
    throw new Error(err);
  }
};
