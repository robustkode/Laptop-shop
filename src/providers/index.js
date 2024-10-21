"use client";

import { CartContextProvider } from "./cart-context";
import AuthProvider from "./next-auth";
import { QueryProvider } from "./rect-query";
export function Providers({ children }) {
  return (
    <AuthProvider>
      <QueryProvider>
        <CartContextProvider>{children}</CartContextProvider>
      </QueryProvider>
    </AuthProvider>
  );
}
