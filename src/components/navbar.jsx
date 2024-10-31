"use client";
import Link from "next/link";
import Container from "./container";
import { useCartContext } from "@/providers/cart-context";
import { CarTaxiFront } from "lucide-react";
import { Laptop } from "lucide-react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { cartProducts } = useCartContext();
  const { data, status } = useSession();
  const pathname = usePathname();
  return (
    <header className="pb-0 bg-primary text-primary-foreground">
      <Container
        as="div"
        className="grid grid-cols-2 sm:grid-cols-navbar-lg items-center sm:gap-12 gap-4 pb-2 sm:pb-0 pt-2 sm:pt-0"
      >
        <div>
          <Button variant="nav-link" className="p-0 m-0">
            <Link href={"/"}>
              <h1 className="font-header text-xl font-bold">Fulan-shop</h1>
            </Link>
          </Button>
        </div>
        <nav className="col-span-2 order-3 sm:order-2 small-nav:col-span-1  py-4 hidden sm:block">
          <ul className="flex justify-between gap-4 items-center font-bold">
            <li>
              <Button variant="nav-link">
                <Link href="/products" className="font-bold">
                  Laptops
                </Link>
              </Button>
            </li>

            <li>
              <Link href="/cart">
                <div className="relative">
                  <Button variant="nav-link">
                    <Heart />
                  </Button>
                  {cartProducts.length ? (
                    <span className="absolute top-0 right-1 bg-secondary rounded-full text-sm w-[20px] h-[20px] text-secondary-foreground flex items-center justify-center">
                      {cartProducts.length}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </Link>
            </li>
            <li>
              <Button variant="nav-link">
                <Link href="/orders" className="font-bold">
                  Orders
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
        <div className="justify-self-end sm:order-3 ml-8">
          {status === "authenticated" ? (
            <Button
              variant="outline"
              className="bg-primary hover:text-muted/70 hover:border-muted/70"
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          ) : (
            <Button variant="secondary">
              <Link href={`/sign-in?callBackUrl="${pathname ? pathname : "/"}`}>
                Sign in
              </Link>
            </Button>
          )}
        </div>
      </Container>
      <div className="bg-primary-drk sm:hidden">
        <Container as="div">
          <nav className="col-span-2 order-3 sm:order-2 sm:col-span-1  py-4">
            <ul className="flex justify-between gap-4 items-center">
              <li>
                <Button variant="nav-link">
                  <Link href="/products" className="font-bold">
                    Laptops
                  </Link>
                </Button>
              </li>

              <li>
                <Link href="/cart">
                  <div className="relative">
                    <Button variant="nav-link">
                      <Heart />
                    </Button>
                    {cartProducts.length ? (
                      <span className="absolute top-0 right-1 bg-secondary rounded-full text-sm w-[20px] h-[20px] text-secondary-foreground flex items-center justify-center">
                        {cartProducts.length}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </Link>
              </li>
              <li>
                <Button variant="nav-link">
                  <Link href="/orders" className="font-bold">
                    Orders
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
