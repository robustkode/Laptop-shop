"use client";
import Container from "@/components/container";
import ErrorMessage from "@/components/error-message";
import OrderCard from "@/components/order-card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import DeclineOrderButton from "./_components/decline-order-button";
import CompleteOrderButton from "./_components/complete-order-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const fetchProducts = (pageParam, status) => {
  return apiClient.get(`/admin-orders?pageParam=${pageParam}&status=${status}`);
};

// export default function OrdersPage() {
//   const { ref, inView } = useInView();
//   const {
//     data,
//     error,
//     isError,
//     isPending,
//     fetchNextPage,
//     isFetchingNextPage,
//     refetch,
//   } = useInfiniteQuery({
//     queryKey: ["admin-orders"],
//     queryFn: async ({ pageParam }) => await fetchProducts(pageParam),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => lastPage.nextCursor,
//     getPreviousPageParam: (firstPage) => firstPage.prevCursor,
//   });

//   useEffect(() => {
//     if (inView && !isError) {
//       fetchNextPage();
//     }
//   }, [inView, fetchNextPage, isError]);
//   return (
//     <main>
//       <Container>
//         <h1 className="page-header">Orders</h1>
//         {isPending ? (
//           <div>pending</div>
//         ) : isError ? (
//           <ErrorMessage message={error.message} retry={refetch} />
//         ) : (
//           <div className="mt-12">
//             {data.pages.length === 1 && data.pages[0].products.length === 0 && (
//               <div className="flex flex-col items-center gap-4">
//                 <h2 className="text-2xl">No orders yet!</h2>
//               </div>
//             )}
//             {data.pages.map((page, i) => (
//               <div
//                 key={page.currentPage}
//                 className="grid md:grid-cols-2 gap-12"
//               >
//                 {page.products?.map((d) => (
//                   <div key={d.id} className="">
//                     <OrderCard order={d} style="flex sm:flex-row" />
//                     <div className="flex">
//                       <CompleteOrderButton id={{ id: d.id }} />
//                       <DeclineOrderButton variant="link" id={{ id: d.id }}>
//                         Decline
//                       </DeclineOrderButton>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}
//       </Container>
//     </main>
//   );
// }

export default function OrdersPage() {
  return (
    <main>
      <Container className={"py-12"}>
        <Tabs defaultValue="new">
          <TabsList className="grid max-w-[400px] grid-cols-2">
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            <Orders />
          </TabsContent>
          <TabsContent value="completed">
            <Orders
              status="completed"
              emptyMessage="No completed orders yet."
            />
          </TabsContent>
        </Tabs>

        {/* <Button onClick={() => setCompleted(!completed)}>
          Toggle: {completed === true ? "True" : "False"}
        </Button>
        <h1 className="page-header">Orders</h1>
        {!completed ? (
          <Orders />
        ) : (
          <Orders status="completed" emptyMessage="No completed orders." />
        )} */}
      </Container>
    </main>
  );
}

function Orders({ status = "new", emptyMessage = "No new orders yet." }) {
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
    queryKey: [`admin-orders-${status}`],
    queryFn: async ({ pageParam }) => await fetchProducts(pageParam, status),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });

  useEffect(() => {
    if (inView && !isError) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isError]);

  return isPending ? (
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
      {data.pages.length === 1 && data.pages[0].products.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-12">
          <h2 className="text-2xl">{emptyMessage}</h2>
        </div>
      )}
      {/* <OrdersList data={data} /> */}
      {data.pages.map((page, i) => (
        <div key={page.currentPage} className="grid md:grid-cols-2 gap-12">
          {page.products?.map((d) => (
            <div key={d.id} className="">
              <OrderCard order={d} style="flex sm:flex-row" />
              {status !== "completed" ? (
                <div className="flex">
                  <CompleteOrderButton id={{ id: d.id }} />
                  <DeclineOrderButton variant="link" id={{ id: d.id }}>
                    Decline
                  </DeclineOrderButton>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function OrdersList({ data }) {
  return data.pages.map((page, i) => (
    <div key={page.currentPage} className="grid md:grid-cols-2 gap-12">
      {page.products?.map((d) => (
        <div key={d.id} className="">
          <OrderCard order={d} style="flex sm:flex-row" />
          <div className="flex">
            <CompleteOrderButton id={{ id: d.id }} />
            <DeclineOrderButton variant="link" id={{ id: d.id }}>
              Decline
            </DeclineOrderButton>
          </div>
        </div>
      ))}
    </div>
  ));
}
