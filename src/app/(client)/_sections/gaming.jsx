import { cache } from "@/lib/cache";
import ProductCatalog from "../_components/product-catalog";
import { Suspense } from "react";
import { getProducts } from "@/data-access/products";
import { getProductsWithTagUseCase } from "@/use-access/products";

const cachedResponse = cache(
  async () => {
    return getProductsWithTagUseCase({ name: "Gaming", limit: 6 });
  },
  ["gaming"],
  { revalidate: 2, tags: ["/", "gaming"] }
);

export default async function Gaming() {
  return (
    <section className="py-12">
      <Suspense fallback="loading...">
        <ProductsSuspense />
      </Suspense>
    </section>
  );
}

async function ProductsSuspense() {
  const products = await cachedResponse();
  const flattendProducts = products.map((data) => data.product);
  return (
    <ProductCatalog header={"Gaming Laptops"} products={flattendProducts} />
  );
}
