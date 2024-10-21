import { getProductsCount } from "@/data-access/products";
import { assertModerator } from "@/lib/authorization";
import { PublicError } from "@/lib/errors";

export const GET = async (req) => {
  try {
    await assertModerator();
    const count = await getProductsCount();
    return new Response(JSON.stringify({ count: count }));
  } catch (error) {
    const isAllowedError = error instanceof PublicError;
    console.log("product-count-api-error", error);
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
