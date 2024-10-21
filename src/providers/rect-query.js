"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query";
export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : (
        ""
      )}
      {children}
    </QueryClientProvider>
  );
}
