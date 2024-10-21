"use client";
import Link from "next/link";
import Container from "./container";
import { useCartContext } from "@/providers/cart-context";
import { CarTaxiFront } from "lucide-react";
import { Laptop } from "lucide-react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { cartProducts } = useCartContext();
  const { data, status } = useSession();

  return (
    <header className="sm:py-2 pt-2 pb-0 bg-primary text-primary-foreground">
      {/* <Container as="div" className="flex justify-between items-center"> */}
      <Container
        as="div"
        className="grid grid-cols-2 sm:grid-cols-navbar-lg items-center sm:gap-12 gap-2"
      >
        <div>
          <Container as="div">
            <h1>Logo</h1>
          </Container>
        </div>
        <nav className="col-span-2 order-3 sm:order-2 sm:col-span-1 bg-primary-drk sm:bg-primary py-4">
          <Container as="div">
            <ul className="flex justify-between gap-4 items-center">
              <li>
                <Link href="/products">
                  {/* <span className="hidden sm:block">Laptops</span>
                  <Laptop className="sm:hidden block" /> */}
                  Laptops
                </Link>
              </li>

              <li>
                <Link href="/cart">
                  <div className="relative">
                    <Heart />
                    {cartProducts.length ? (
                      <span className="absolute -top-2 -right-2 bg-secondary rounded-full text-sm w-[20px] h-[20px] text-secondary-foreground flex items-center justify-center">
                        {cartProducts.length}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/orders">Orders</Link>
              </li>
            </ul>
          </Container>
        </nav>
        <div className="justify-self-end sm:order-3">
          <Container as="div">
            {status === "authenticated" ? (
              <Button
                variant="outline"
                className="bg-primary hover:text-muted/70 hover:border-muted/70"
              >
                <Link href={"/api/auth/signout"}>Sign out</Link>
              </Button>
            ) : (
              <Button variant="secondary">
                <Link href={"/sign-in"}>Sign in</Link>
              </Button>
            )}
          </Container>
        </div>
      </Container>
    </header>
  );
}
