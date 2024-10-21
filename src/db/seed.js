"use server";
import { hashPassword } from "@/lib/utils";
import crypto from "crypto";
import { customers, users } from "./schema";
import { db } from ".";
import { admins } from "./schema";
import { signUpGoogleUseCase } from "@/use-access/users";

const password = "123456";

const salt1 = crypto.randomBytes(128).toString("base64");
const hash1 = await hashPassword(password, salt1);

const salt2 = crypto.randomBytes(128).toString("base64");
const hash2 = await hashPassword(password, salt2);

const salt3 = crypto.randomBytes(128).toString("base64");
const hash3 = await hashPassword(password, salt3);

const usersData = [
  {
    id: crypto.randomUUID(),
    email: "admin@test.com",
    password: hash1,
    salt: salt1,
    role: 3,
  },
  {
    id: crypto.randomUUID(),
    email: "mod1@test.com",
    password: hash2,
    salt: salt2,
    role: 2,
  },
  {
    id: crypto.randomUUID(),
    email: "user1@test.com",
    password: hash3,
    salt: salt3,
    role: 1,
  },
];

const id1 = "5a8e4eef-799d-4969-9d8c-d95bdc3fe6c1";
const id2 = "07e09a88-9711-4718-a1d0-cc3afd7517b4";
const id3 = "335cce72-0260-4d46-9244-0b7af56d5761";

const adminData = [
  {
    name: "admin",
    userId: id1,
  },
  {
    name: "moderator",
    userId: id2,
  },
];

export async function seedUsers() {
  //await db.insert(users).values(usersData);
  await db.insert(admins).values(adminData);
  await db.insert(customers).values({ userId: id1, name: "user" });
}

export async function runSeed() {
  try {
    //await seedUsers();
    const user = await signUpGoogleUseCase({
      name: "Kalid Ahmed ",
      email: "kljijo@gmail.com",
    });
    console.log("seed succeded", user);
  } catch (e) {
    console.error("seed failed", e);
  }
}
