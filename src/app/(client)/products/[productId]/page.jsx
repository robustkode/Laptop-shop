import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import VariantsList from "@/components/variants-list";
import { ProductVariantDAL } from "@/data-access-layer/variants";
import { getProductById } from "@/data-access/products";
import { getAllProductVariants } from "@/data-access/variants";
import { cache } from "@/lib/cache";
import { Check } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AddToCartButton from "../../_components/add-cart-button";
import _ from "lodash";
import { ProductVariants } from "../_components/variants-list";
import { Card } from "@/components/ui/card";
import HelpCard from "../../_components/help-card";
import { Skeleton } from "@/components/ui/skeleton";
const cachedProduct = cache(
  async (id) => {
    return getProductById(id);
  },
  ["product"],
  { tags: ["product"] }
);

const cachedVariants = cache(
  async (id) => {
    return getAllProductVariants(id);
  },
  ["variant"]
);

export default function Product({ params }) {
  const { productId } = params;
  return (
    <Suspense
      fallback={
        <Container className="flex flex-col gap-4">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-6 w-[512px]" />
          <Skeleton className="h-8 w-24" />
          <div className="flex justify-center mt-6">
            <Skeleton className="h-64 w-64" />
          </div>
        </Container>
      }
    >
      <ProductSuspense id={productId} />
    </Suspense>
  );
}

async function ProductSuspense({ id }) {
  const product = await cachedProduct(id);
  if (!product) notFound();
  return (
    <main>
      <Container>
        <div className="flex flex-col">
          <h1 className="header text-xl py-4">{product.name}</h1>
          <div className="flex sm:gap-8 gap-4 flex-wrap">
            <p className="text-muted-foreground">
              Price:{" "}
              <span className="text-primary font-header">{product.price}</span>{" "}
              Birr
            </p>
            <p className="text-muted-foreground">
              Brand:{" "}
              <span className="text-primary font-header">{product.brand}</span>
            </p>
            <p>
              Model:{" "}
              <span className="text-primary font-header">{product.model}</span>
            </p>
          </div>
          <div className="py-1">
            <AddToCartButton product={product} />
          </div>
          <div>
            <Image
              src={product.images}
              alt="product-image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-[100%] object-cover max-w-[300px] mx-auto"
              priority
            />
          </div>
          <ProductVariants id={id} />
          <section>
            <h2 className="sub-header">Overview</h2>
            <p>{product.description}</p>
            <div className="mt-6">
              <h3 className="sub-header pb-1">Specifications</h3>
              <div className="grid sm:grid-cols-2 sm:gap-8 gap-4">
                <Card>
                  <div className="flex flex-col gap-1 sm:shadow-md p-4 rounded-md">
                    <div className="flex items-end">
                      <Check className="icon-lg  text-primary mr-2" />
                      <p>
                        Brand:
                        <span className="font-header ml-2">
                          {product.brand}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Check className="icon-lg  text-primary mr-2" />
                      <p>
                        Model:
                        <span className="font-header ml-2">
                          {product.model}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Check className="icon-lg  text-primary mr-2" />
                      <p>
                        RAM:
                        <span className="font-header ml-2">{product.ram}</span>
                        GB
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Check className="icon-lg  text-primary mr-2" />
                      <p>
                        Storage type:
                        <span className="font-header ml-2">
                          {product.storageType}
                        </span>
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex flex-col gap-1 p-4">
                    <div className="flex items-end">
                      <Check className="icon-lg  text-primary mr-2" />
                      <p>
                        Storage:
                        <span className="font-header ml-2">
                          {product.storage}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Check className="icon-lg  text-primary mr-2" />
                      <p>
                        Generation:
                        <span className="font-header ml-2">
                          {product.generation}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Check className="icon-lg  text-primary mr-2" />
                      <p>
                        Condition:
                        <span className="font-header ml-2">
                          {product.condition}
                        </span>
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </div>
        <div className="py-1">
          <AddToCartButton variant="default" product={product} />
        </div>
        <div className="pt-8 pb-6">
          <HelpCard />
        </div>
      </Container>
    </main>
  );
}

async function VariantsSuspense({ id }) {
  const variantsData = await cachedVariants(id);
  if (!variantsData.length) return;
  const variants = ProductVariantDAL(variantsData);
  if (!variants.length) return;

  const groupedData = _.chain(variants)
    .groupBy("variant")
    .map((variants, name) => ({
      name,
      variants: variants.map(({ id, value, price, inventory }) => ({
        id,
        value,
        price,
        inventory,
      })),
    }))
    .value();

  return (
    <section>
      <h3 className="sub-header">Variants</h3>
      <VariantsList organizedData={groupedData} />
    </section>
  );
}
