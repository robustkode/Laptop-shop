"use client";

import { Button } from "@/components/ui/button";
import { useCartContext } from "@/providers/cart-context";
import React, { useMemo } from "react";

export default function AddToCartButton({
  product,
  variant = "secondary",
  className = "",
}) {
  const { cartProducts, addRemoveCartItem, isInCart } = useCartContext();

  return (
    <div className="py-2">
      <Button
        variant={variant}
        className={className}
        onClick={() => addRemoveCartItem(product)}
      >
        {isInCart(product.id) ? "Remove from cart" : "Add to cart"}
      </Button>
    </div>
  );
}
