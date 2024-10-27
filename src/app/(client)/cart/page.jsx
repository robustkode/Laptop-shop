"use client";
import Container from "@/components/container";
import useActionWrapper from "@/lib/action-wrapper";
import { useCartContext } from "@/providers/cart-context";
import { orderProductAction } from "./action";
import { Button } from "@/components/ui/button";
import { LoaderButton } from "@/components/loader-button";
import ProductCard from "../products/_components/product-card";
import Link from "next/link";
import OrderButton from "./_components/order-button";
import PageHero from "../_components/page-hero";

const HERO = {
  header: "Your favourite laptops",
  description:
    "With just a few clicks, you can place your order and have your laptop.",
};

export default function CartPage() {
  const { cartProducts, addRemoveCartItem } = useCartContext();

  return (
    <main>
      <PageHero {...HERO} />
      <Container className={"my-12"}>
        <div className="flex flex-col min-h-[50vh]">
          {!cartProducts || !cartProducts.length ? (
            <div className="w-full flex flex-col  justify-center mt-16">
              <h1 className="text-center">No product in the cart.</h1>
              <div className="flex items-center justify-center font-header">
                <p className="font-header">Look at products,</p>
                <Button variant="link" className="px-1">
                  <Link href={"/products"}>here</Link>
                </Button>
              </div>
            </div>
          ) : (
            cartProducts.map((product) => (
              <div key={product.id}>
                <ProductCard {...product} style="flex sm:flex-row flex-col" />
                <div className="flex gap-4 items-end mt-4">
                  <OrderButton
                    order={{
                      id: product.id,
                      quantity: 1,
                      productVariant: product.productVariants,
                    }}
                  >
                    Order
                  </OrderButton>
                  <Button
                    variant="link"
                    onClick={() => addRemoveCartItem(product)}
                  >
                    Remove from cart
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Container>
    </main>
  );
}
