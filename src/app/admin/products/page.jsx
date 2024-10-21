"use client";

import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import ErrorMessage from "@/components/error-message";
import ProductCard from "@/app/(client)/products/_components/product-card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchProducts = (pageParam) => {
  return apiClient.get("/products?pageParam=" + pageParam);
};

const fetchProductsCount = () => {
  return apiClient.get("/products/count");
};

export default function Products() {
  const { ref, inView } = useInView();
  const {
    data,
    error,
    isError,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["scholarships"],
    queryFn: async ({ pageParam }) => await fetchProducts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });

  const { data: count } = useQuery({
    queryKey: ["products-count"],
    queryFn: async () => await fetchProductsCount(),
  });
  useEffect(() => {
    if (inView && !isError) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isError]);

  return (
    <main>
      <Container>
        {isPending ? (
          <div className="grid md:grid-cols-2 gap-8 py-12">
            {[...Array(8)].map((_, i) => (
              <div className="flex gap-4" key={i}>
                <Skeleton className="h-32 w-[200px]" />
                <div className="flex flex-col gap-4 w-full">
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorMessage message={error.message} retry={refetch} />
        ) : (
          <div className="mt-12">
            {data.pages.length === 1 && data.pages[0].products.length === 0 ? (
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl">No Prodcuts yet!</h2>
                <Button className="ml-auto">
                  <Link href={"/admin/products/create"}>Create a product</Link>
                </Button>
              </div>
            ) : count ? (
              <h1 className="sub-header my-4">{count.count} Products</h1>
            ) : (
              ""
            )}
            {data.pages.map((page, i) => (
              <div key={page.currentPage} className="grid md:grid-cols-2 gap-8">
                {page.products?.map((d) => (
                  <div key={d.id} className="relative">
                    <div className="pl-4">
                      <ProductCard {...d} style="flex sm:flex-row" />
                    </div>
                    <Button className="m-0 p-2 w-fit h-fit rounded-full bg-primary absolute top-0 right-0">
                      <Link href={"/admin/products/" + d.id}>
                        <Pencil className="text-secondary icon-lg" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div ref={ref} className="py-8 text-center">
          {isFetchingNextPage && "Loading..."}
        </div>
      </Container>
    </main>
  );
}
