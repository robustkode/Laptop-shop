"use client";

import Container from "@/components/container";
import ProductsFiter from "./_components/products-filter";
import { useFilterContext } from "./_context";
import useDebounceVal from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import ErrorMessage from "@/components/error-message";
import ProductCard from "./_components/product-card";
import GroupPagination from "@/components/group-pagination";
import { PRODUCTS_PER_PAGE } from "@/config/constants";
import { syncUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import PageHero from "../_components/page-hero";

const HERO = {
  header: "Find out your dream laptop",
  description:
    "Whether you're looking for a powerful machine for gaming, a reliable device for work, or a portable option for school, we’ve got you covered. Use the filters below to narrow down your choices .",
};

const getfilteredProducts = async (filters) => {
  return await apiClient.post("/products/filter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: filters,
  });
};
export default function ProductsPage() {
  const { filters } = useFilterContext();
  const dval = useDebounceVal(filters);

  const {
    isPending,
    isError,
    error,
    data: products,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["products", dval],
    queryFn: () => getfilteredProducts(dval),
    placeholderData: keepPreviousData,
    //! change this
    staleTime: 60 * 60 * 60,
  });

  //sync url with filter
  useEffect(() => {
    if (dval) {
      const queryString = syncUrl(filters);
      window.history.replaceState({}, "", queryString);
    }
  }, [dval]);

  const totalCount = products ? products.totalCount : 0;
  return (
    <div>
      <PageHero {...HERO} />
      <Container className={"pb-12"}>
        <div className="grid md:grid-cols-4 mt-12 md:gap-8">
          <div className="">
            <div>
              <ProductsFiter />
            </div>
          </div>

          <main className="md:col-span-3">
            <div className="">
              {totalCount > 0 ? (
                <h1 className="header text-xl pt-8  py-4">
                  {totalCount} Laptops
                </h1>
              ) : (
                ""
              )}

              {isPending ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg-grid-cols-4 gap-6 my-16">
                  {[...Array(6)].map((_, i) => (
                    <div
                      className="flex sm:flex-col gap-6 sm:gap-2 w-full"
                      key={i}
                    >
                      <Skeleton className="h-24 basis-48" />
                      <div className="flex flex-col gap-2 grow">
                        <Skeleton className="h-4" />
                        <Skeleton className="h-3.5" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <ErrorMessage />
              ) : //(

              //   <div>{JSON.stringify(products)} oops</div>
              // )
              !products.data.length ? (
                <section className="flex flex-col justify-center text-center gap-4 min-h-[40vh]">
                  <h1 className="header text-xl">
                    No product found with filters change filters
                  </h1>
                  <p className="font-bold">Change filters instead.</p>
                </section>
              ) : (
                <div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg-grid-cols-4 gap-6">
                    {products.data.map((p) => (
                      <ProductCard key={p.id} {...p} />
                    ))}
                  </div>
                </div>
              )}
              {products && products.data?.length < totalCount ? (
                <div className="py-4">
                  <GroupPagination
                    totalPages={Math.ceil(totalCount / PRODUCTS_PER_PAGE)}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
