import { cache } from "@/lib/cache";
import ProductCatalog from "../_components/product-catalog";
import { Suspense } from "react";
import { getProducts } from "@/data-access/products";
import { getProductsWithTagUseCase } from "@/use-access/products";

const cachedResponse = cache(
  async () => {
    return getProductsWithTagUseCase({ name: "Classic", limit: 6 });
  },
  ["gaming"],
  { revalidate: 2, tags: ["/", "gaming"] }
);

export default async function Gaming() {
  return (
    <Suspense fallback="loading...">
      <ProductsSuspense />
    </Suspense>
  );
}

async function ProductsSuspense() {
  const products = await cachedResponse();
  const flattendProducts = products.map((data) => data.product);
  return (
    <ProductCatalog header={"Gaming Laptops"} products={flattendProducts} />
  );
}
