import {
  PRICE_RANGE,
  PRODUCTS_PER_PAGE,
  SORT,
  STORAGE,
} from "@/config/constants";
import { getFiteredProducts } from "@/data-access/products";
import { PublicError } from "@/lib/errors";
import { z } from "zod";

const schema = z.object({
  sort: z.string(z.enum(SORT.map((s) => s.value))),
  price: z.string(z.enum(PRICE_RANGE.map((p) => p.value))).nullable(),
  brand: z.array(z.string()),
  condition: z.array(z.string()),
  generation: z.array(z.string()),
  ram: z.array(z.coerce.number()),
  storageType: z.array(z.string()),
  storage: z.string(z.enum(STORAGE.map((s) => s.value))).nullable(),
  page: z.number().nullable(),
  update: z.boolean(),
});
export const POST = async (req) => {
  try {
    const { body } = await req.json();
    const filters = schema.parse(body);
    const products = await getFiteredProducts({
      ...filters,
      pageSize: PRODUCTS_PER_PAGE,
    });
    return new Response(JSON.stringify(products));
  } catch (error) {
    const isAllowedError = error instanceof PublicError;
    console.log("product-filter-api-error", error);
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
