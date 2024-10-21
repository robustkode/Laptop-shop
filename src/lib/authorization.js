"use server";
import { adminRole, moderatorRole } from "@/config";
import { AuthenticationError, AuthorizationError } from "./errors";
import { getCurrentUser } from "./session";

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export async function isAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.role === adminRole;
}

export async function isModerator() {
  const user = await getCurrentUser();

  if (!user) return false;
  return user.role === moderatorRole || user.role === adminRole;
}

export async function assertAdmin() {
  if (!(await isAdmin())) {
    throw new AuthorizationError();
  }
  return await getCurrentUser();
}

export async function assertModerator() {
  if (!(await isModerator())) {
    throw new AuthorizationError();
  }
  return await getCurrentUser();
}
