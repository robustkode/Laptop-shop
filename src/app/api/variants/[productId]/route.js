import { getAllProductVariants } from "@/data-access/variants";
import { PublicError } from "@/lib/errors";

export const GET = async (req, { params }) => {
  try {
    const { productId } = params;
    const variants = await getAllProductVariants(productId);
    let flattendData = variants.map((variant) => {
      if (!variant.productVariantValues.length) {
        return;
      }
      return {
        id: variant.id,
        value: variant.productVariantValues[0].value,
        price: variant.productVariantValues[0].price,
        inventory: variant.productVariantValues[0].inventory,
        variant: variant.productVariantValues[0].productVariant.variant.name,
      };
    });
    flattendData = flattendData.filter((variant) => !!variant);
    return new Response(JSON.stringify(flattendData));
  } catch (error) {
    const isAllowedError = error instanceof PublicError;
    console.log("variants-api-error", error);
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
