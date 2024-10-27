"use client";

import Container from "@/components/container";
import ErrorMessage from "@/components/error-message";
import NoResource from "@/components/no-resource";
import OrderCard from "@/components/order-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const fetchOrders = () => {
  return apiClient.get("/orders");
};

export default function Orders() {
  const { session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/sign-in?callbackUrl=/orders");
    },
  });
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await fetchOrders(),
  });
  return (
    <main className="min-w-[50vh]">
      <Container as="div" className="mt-4">
        <h1 className="page-header">Orders</h1>
      </Container>
      {isPending ? (
        <Container className="grid md:grid-cols-2 gap-8 py-12">
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
        </Container>
      ) : error ? (
        <ErrorMessage retry={refetch} message={error.message} />
      ) : !data.length ? (
        <Container className="flex flex-col justify-center w-full text-center">
          <h1 className="text-xl">You haven&apos;t ordered yet.</h1>
          <p className="font-header text-2xl">
            Add Items to your card and order.{" "}
          </p>
          <div className="flex items-center justify-center mt-4">
            <p>Select prodcuts</p>
            <Button variant="link" className="px-1 underline">
              <Link href={"/products"} className="text-md">
                Here
              </Link>
            </Button>
          </div>
        </Container>
      ) : (
        <Container className={"grid md:grid-cols-2 gap-6"}>
          {data.map((order) => (
            <OrderCard key={order.id} order={order} showCompleted={true} />
          ))}
        </Container>
      )}
    </main>
  );
}
