"use server";
import { afterLoginUrl } from "@/config";
import { BRANDS, CONDITIONS, STORAGE_TYPE } from "@/config/constants";
import { rateLimitByKey } from "@/lib/limiter";
import { handleError } from "@/lib/utils";
import {
  createProductUseCase,
  updateProductUseCase,
} from "@/use-access/products";
import { signInUseCase } from "@/use-access/users";
import { config } from "dotenv";
import { partition } from "lodash";
import { redirect } from "next/navigation";
import { z } from "zod";

config();

export const createProductAction = async (input) => {
  const schema = z.object({
    name: z.string().min(5, { message: "Too short" }),
    description: z.string().min(5, { message: "Too short" }),
    price: z.coerce.number({ message: "Enter number!" }),
    brand: z.enum(BRANDS.map((b) => b.value)),
    inventory: z.coerce.number({ message: "Enter number!" }),
    brand: z.string().min(2, { message: "Too short!" }),
    condition: z.enum(CONDITIONS.map((c) => c.value)),
    generation: z.coerce.number({ message: "Enter number!" }),
    model: z.string().min(3, { message: "Too short!" }),
    ram: z.coerce.number({ message: "Enter number!" }),
    storage: z.coerce.number({ message: "Enter number!" }),
    storageType: z.enum(STORAGE_TYPE.map((s) => s.value)),
    tags: z.array(
      z.object({
        id: z.string().nullable(),
        name: z.string(),
      })
    ),
    images: z.string(),
  });
  let id;
  try {
    const data = schema.parse(input);
    await rateLimitByKey({ key: input.email, limit: 3, window: 10000 });
    const [newTags, existingTags] = partition(
      data.tags,
      (tag) => tag.id === null
    );
    // console.log(newTags, existingTags, "oop");
    const { tags, ...rest } = data;
    id = await createProductUseCase({ input: rest, newTags, existingTags });
  } catch (error) {
    console.log("create product error");
    return handleError(error);
  }
  redirect("/products/" + id);
};

export const updateProductAction = async (input) => {
  const schema = z.object({
    id: z.string(),
    name: z.string().min(5, { message: "Too short" }),
    description: z.string().min(5, { message: "Too short" }),
    price: z.coerce.number({ message: "Enter number!" }),
    brand: z.enum(BRANDS.map((b) => b.value)),
    inventory: z.coerce.number({ message: "Enter number!" }),
    brand: z.string().min(2, { message: "Too short!" }),
    condition: z.enum(CONDITIONS.map((c) => c.value)),
    generation: z.coerce.number({ message: "Enter number!" }),
    model: z.string().min(3, { message: "Too short!" }),
    ram: z.coerce.number({ message: "Enter number!" }),
    storage: z.coerce.number({ message: "Enter number!" }),
    storageType: z.enum(STORAGE_TYPE.map((s) => s.value)),
    tags: z.array(
      z.object({
        id: z.string().nullable(),
        name: z.string(),
      })
    ),
    images: z.string(),
  });
  let id = input.id;
  try {
    const data = schema.parse(input);
    // await rateLimitByKey({ key: input.email, limit: 3, window: 10000 });
    const [newTags, existingTags] = partition(
      data.tags,
      (tag) => tag.id === null
    );
    // console.log(newTags, existingTags, "oop");
    const { tags, ...rest } = data;
    await updateProductUseCase({ input: rest, newTags, existingTags });
  } catch (error) {
    console.log("create product error");
    return handleError(error);
  }
  redirect("/products/" + id);
};
