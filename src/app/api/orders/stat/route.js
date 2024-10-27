import { getUserOrders } from "@/data-access/orders";
import { assertAuthenticated, assertModerator } from "@/lib/authorization";
import { PublicError } from "@/lib/errors";
import {
  getMonthlysStatUseCase,
  getOrderStatUseCase,
} from "@/use-access/orders";
import * as z from "zod";

export const GET = async (req) => {
  try {
    await assertModerator();
    const monthParam = req.nextUrl.searchParams.get("month");
    const schema = z.coerce.number();
    const month = schema.safeParse(monthParam);
    const stat = await getMonthlysStatUseCase(month.success ? month.data : 0);
    return new Response(JSON.stringify(stat));
  } catch (error) {
    const isAllowedError = error instanceof PublicError;
    console.log("product-api-error", error);
    return new Response(
      JSON.stringify({
        error: {
          message: isAllowedError
            ? error.message
            : "Server error, Something went wrong!",
        },
      }),
      { status: 500 }
    );
  }
};
