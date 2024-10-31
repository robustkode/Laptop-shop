import { getUserOrders } from "@/data-access/orders";
import { assertAuthenticated, assertModerator } from "@/lib/authorization";
import { PublicError } from "@/lib/errors";
import { getCurrentUser } from "@/lib/session";

export const GET = async (req) => {
  try {
    const user = await assertAuthenticated();
    const orders = await getUserOrders(user.id);
    return new Response(JSON.stringify(orders));
  } catch (error) {
    const isAllowedError = error instanceof PublicError;
    console.log("orders-api-error", error);
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
