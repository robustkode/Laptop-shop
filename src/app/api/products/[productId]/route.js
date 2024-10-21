import { getProductById } from "@/data-access/products";
import { getProductTags, getTags } from "@/data-access/tags";
import { PublicError } from "@/lib/errors";

export const GET = async (req, { params }) => {
  try {
    const { productId } = params;
    const productPromise = getProductById(productId);
    const tagsPromise = getProductTags(productId);
    const [product, tags] = await Promise.all([productPromise, tagsPromise]);

    return new Response(
      JSON.stringify({ product: product ? product : null, tags: tags })
    );
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
