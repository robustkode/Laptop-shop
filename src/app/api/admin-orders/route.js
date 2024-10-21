import { fetchOrdersPaginated } from "@/data-access/orders";
import { orderStatus } from "@/db/schema";
import { assertAdmin } from "@/lib/authorization";
import { PublicError } from "@/lib/errors";
import * as z from "zod";

const pageSchema = z.coerce.number();
const statusSchema = z.string(z.enum(orderStatus));

export const GET = async (req, { params }) => {
  try {
    await assertAdmin();
    let page = req.nextUrl.searchParams.get("pageParam");
    let status = req.nextUrl.searchParams.get("status");
    const pageParam = pageSchema.safeParse(page).data;
    const statusParam = statusSchema.safeParse(status).data;
    const products = await fetchOrdersPaginated(
      page ? pageParam : 1,
      8,
      "desc",
      statusParam ? statusParam : orderStatus[0]
    );
    return new Response(JSON.stringify(products));
  } catch (error) {
    const isAllowedError = error instanceof PublicError;
    console.log("order-api-error", error);
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
