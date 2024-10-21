import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/utils";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { customers } from "@/db/schema";

export async function getUserByEmail(email) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user;
}

export async function getUserByPhone(phone) {
  const user = await db.query.users.findFirst({
    where: eq(users.phone, phone),
  });
  return user;
}

export async function createUser({ password, name, email, phone }) {
  if (password) {
    const salt = crypto.randomBytes(128).toString("base64");
    const passwordHash = await hashPassword(password, salt);
    const [{ id }] = await db
      .insert(users)
      .values({ salt, password: passwordHash, name, email, phone })
      .returning();
    return id;
  } else {
    const [{ id, role }] = await db
      .insert(users)
      //! remove password and salt
      .values({
        name,
        email,
        accountType: "google",
        password: "123456",
        salt: "123456",
      })
      .returning();
    return { id, role };
  }
}

export async function createCustomer(values) {
  const [user] = await db.insert(customers).values(values).returning();
  return user;
}
