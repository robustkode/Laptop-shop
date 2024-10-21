import { cache } from "@/lib/cache";
import ProductCatalog from "../_components/product-catalog";
import { Suspense } from "react";
import { getProducts } from "@/data-access/products";

const cachedResponse = cache(
  async () => {
    return getProducts("price", 6, "asc");
  },
  ["budget"],
  { revalidate: 2, tags: ["/", "budget"] }
);

export default async function Budget() {
  return (
    <Suspense fallback="loading...">
      <ProductsSuspense />
    </Suspense>
  );
}

async function ProductsSuspense() {
  const products = await cachedResponse();
  return <ProductCatalog header={"Budget Laptops"} products={products} />;
}
