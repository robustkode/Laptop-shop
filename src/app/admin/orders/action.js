"use server";
import { handleError } from "@/lib/utils";
import { completeOrderUseCase, declineOrderUseCase } from "@/use-access/orders";
import { z } from "zod";

export const declineOrderAction = async (input) => {
  const schema = z.object({
    id: z.string(),
  });
  try {
    const data = schema.parse(input);
    await declineOrderUseCase(data);
  } catch (error) {
    console.log("decline order error");
    return handleError(error);
  }
};

export const completeOrderAction = async (input) => {
  const schema = z.object({
    id: z.string(),
  });
  try {
    const data = schema.parse(input);
    await completeOrderUseCase(data);
  } catch (error) {
    console.log("decline order error");
    return handleError(error);
  }
};
