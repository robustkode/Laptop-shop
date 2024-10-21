"use server";
import { assertAuthenticated } from "@/lib/authorization";
import { rateLimitByKey } from "@/lib/limiter";
import { handleError } from "@/lib/utils";
import { createOrderUseCase } from "@/use-access/orders";
import { config } from "dotenv";

import { redirect } from "next/navigation";
import { z } from "zod";

config();

export const orderProductAction = async (input) => {
  const schema = z.object({
    id: z.string(),
    productVariantId: z.string().optional(),
    //! positive number
    quantity: z.coerce.number(),
    value: z.string().optional(),
    variantName: z.string().optional(),
  });

  try {
    const user = await assertAuthenticated();
    const data = schema.parse(input);
    await rateLimitByKey({ key: user.email, limit: 3, window: 10000 });
    await createOrderUseCase(data, user);
  } catch (error) {
    console.log("create order error");
    return handleError(error);
  }
  redirect("/orders");
};
