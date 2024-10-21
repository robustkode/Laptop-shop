import {
  fetchProductsPaginated,
  getFiteredProducts,
} from "@/data-access/products";
import { PublicError } from "@/lib/errors";
import * as z from "zod";

const PAGE_SIZE = 10;
export const GET = async (req) => {
  try {
    const schema = z.coerce.number();
    let page = req.nextUrl.searchParams.get("pageParam");
    const pageParam = schema.parse(page);
    // const products = await fetchProductsPaginated(page, PAGE_SIZE, "createdAt");
    const products = await fetchProductsPaginated(pageParam, 5, "desc");

    return new Response(JSON.stringify(products));
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

export const POST = async (req) => {
  try {
    console.log("oops");
    const { body } = await req.json();

    const data = { ...body };
    const products = await getFiteredProducts(body);
    return new Response(JSON.stringify(products));
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
