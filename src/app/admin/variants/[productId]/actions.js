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
import createVariantUseCase, {
  deleteProductVarianUseCase,
} from "@/use-access/variants";
import { config } from "dotenv";
import { partition } from "lodash";
import { redirect } from "next/navigation";
import { z } from "zod";

config();

export const addVaraintAction = async (input) => {
  const schema = z.object({
    name: z.string(),
    price: z.coerce.number(),
    value: z.union([
      z.string().min(2, { message: "Too short" }),
      z.coerce.number(),
    ]),
    //! positive number
    inventory: z.coerce.number(),
    productId: z.string(),
  });
  try {
    const data = schema.parse(input);

    await createVariantUseCase(data);
  } catch (error) {
    console.log("create variant error");
    return handleError(error);
  }
  redirect(`/admin/products/${input.productId}`);
};

export const deleteProductVarianAction = async (input) => {
  const schema = z.object({
    id: z.string(),
  });
  try {
    const data = schema.parse(input);
    await deleteProductVarianUseCase(data);
  } catch (error) {
    console.log("create product error");
    return handleError(error);
  }
};
