import { cache } from "@/lib/cache";
import ProductCatalog from "../_components/product-catalog";
import { Suspense } from "react";
import { getProducts } from "@/data-access/products";

const cachedResponse = cache(
  async () => {
    return getProducts("price", 6);
  },
  ["powerful"],
  { revalidate: 2, tags: ["/", "powerful"] }
);

export default async function Powerful() {
  return (
    <section className="bg-primary-bg py-12">
      <Suspense fallback="loading...">
        <ProductsSuspense />
      </Suspense>
    </section>
  );
}

async function ProductsSuspense() {
  const products = await cachedResponse();
  return <ProductCatalog header={"Powerfull computers"} products={products} />;
}
