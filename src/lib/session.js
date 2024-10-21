"use server";
import { config } from "@/app/api/auth/[...nextauth]/config";
import { getServerSession } from "next-auth";
import { cache as reactCache } from "react";

export const getCurrentUser = reactCache(async (...args) => {
  const session = await getServerSession(...args, config);
  return session?.user;
});
