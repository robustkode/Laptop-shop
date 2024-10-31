"use client";

import Container from "@/components/container";
import React, { useMemo } from "react";
import ProductForm from "../_components/create-product-form";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteVariantButton from "../../variants/[productId]/_components/delete-variant-button";
import { notFound } from "next/navigation";
import _ from "lodash";

export const dynamic = "force-dynamic";

const getProductData = (id) => {
  return apiClient.get("/products/" + id);
};

const getAllTags = async () => {
  return await apiClient.get(process.env.NEXT_PUBLIC_API_URL + "/tags");
};

export default function EditProduct({ params }) {
  const { productId } = params;

  const { data, isError, isPending, error, refetch } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => await getProductData(productId),
  });

  // const {
  //   data: allTags,
  //   isError: isTagsError,
  //   error: tagsError,
  // } = useQuery({
  //   queryKey: ["product", productId],
  //   queryFn: async () => await getProductData(productId),
  // });

  if (data !== undefined && data.product === null) notFound();
  return (
    <main className="py-12">
      <section>
        <Container as="div">
          <ProductVariants id={productId} />
        </Container>
      </section>
      <Container>
        {isPending ? (
          <div>Loading</div>
        ) : isError ? (
          <ErrorMessage error={error.message} retry={refetch} />
        ) : (
          <ProductForm
            datas={{ product: data.product, productTags: data.tags }}
          />
        )}
      </Container>
    </main>
  );
}

const getProductVariants = (id) => {
  return apiClient.get("/variants/" + id);
};

function ProductVariants({ id }) {
  const { data, isError, isPending, error, refetch } = useQuery({
    queryKey: ["variants", id],
    queryFn: async () => await getProductVariants(id),
  });

  const organizedData = useMemo(() => {
    if (data && data.length) {
      // Group by variant name
      const groupedData = _.chain(data)
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

      return groupedData;
    }
    return [];
  }, [data]);

  return (
    <div className="flex flex-wrap">
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <ErrorMessage
          error={error.message}
          retry={refetch}
          className={"w-full"}
        />
      ) : (
        <div className="w-full">
          {!data.length ? (
            <div className="flex items-center justify-center w-full flex-col gap-4">
              <p className="header text-xl">No variants yet!</p>
              <Button>
                <Link href={`/admin/variants/${id}`}>Add variant</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {organizedData.map((group) => (
                <div key={group.name} className="">
                  <h4 className="header text-xl pb-1">{group.name}</h4>
                  <div className="flex gap-12 flex-wrap">
                    {group.variants.map((variant) => (
                      <div
                        className="flex flex-col px-4 py-2 shadow-md"
                        key={variant.id}
                      >
                        <p>
                          <span className="header text-primary-drk">
                            {variant.value}
                          </span>
                        </p>
                        <p>
                          <span>{variant.price} Birr</span>
                        </p>
                        <p>
                          {variant.inventory}{" "}
                          <span className="text-muted-foreground">
                            in stock.
                          </span>
                        </p>
                        <DeleteVariantButton
                          tobedeltedId={{ id: variant.id }}
                          productId={id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button className="w-fit ">
                <Link href={`/admin/variants/${id}`}>Add variant</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
