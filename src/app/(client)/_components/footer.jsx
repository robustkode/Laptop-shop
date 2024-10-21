import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { Instagram } from "lucide-react";
import { Facebook } from "lucide-react";
import { Locate } from "lucide-react";
import { Send } from "lucide-react";
import { Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-drk text-primary-foreground/60 py-6">
      <Container as="div" className={"grid sm:grid-cols-3 gap-6"}>
        <div className="flex flex-col gap-2">
          <h1 className="text-lg pb-1 text-primary-foreground font-header">
            Fulan computers
          </h1>
          <p>Buy origional laptops at affordable price</p>
          <Button className="max-w-48" variant="secondary">
            <Link href={"/products"}>Explore</Link>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="icon"
              className="bg-primary/30 px-2.5 py-1 rounded-md"
            >
              <Link href={"https://www.yutube.com"}>
                <Youtube className="icon-lg text-red-500" />
              </Link>
            </Button>
            <Button
              variant="icon"
              className="bg-primary/30 px-2.5 py-1 rounded-md"
            >
              <Link href={"https://www.yutube.com"}>
                <Facebook className="icon-lg text-blue-500" />
              </Link>
            </Button>
            <Button
              variant="icon"
              className="bg-primary/30 px-2.5 py-1 rounded-md"
            >
              <Link href={"https://www.yutube.com"}>
                <Instagram className="icon-lg text-purple-500" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:justify-self-center">
          <h4 className="text-lg pb-1 text-primary-foreground font-header">
            Laptops
          </h4>
          <Button variant="link" className="p-0 m-0 w-fit text-inherit text-md">
            <Link href="/products?brand=apple">Apple</Link>
          </Button>
          <Button variant="link" className="p-0 m-0 w-fit text-inherit text-md">
            <Link href="/products?brand=lenovo">Lenevo</Link>
          </Button>
          <Button variant="link" className="p-0 m-0 w-fit text-inherit text-md">
            <Link href="/products?brand=assus">Assus</Link>
          </Button>
          <Button variant="link" className="p-0 m-0 w-fit text-inherit text-md">
            <Link href="/products?brand=toshiba">Toshiba</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-4 sm:justify-self-end">
          <h4 className="text-lg pb-1 text-primary-foreground font-header">
            Contacts
          </h4>
          <div className="flex items-center gap-4">
            <Phone className="icon-lg text-primary" />
            0912121212
          </div>
          <div className="flex items-center gap-4">
            <Send className="icon-lg text-primary" />
            <Link href={"t.me/my-computer"}>@my-computer</Link>
          </div>
          <div className="flex items-center gap-4">
            <Locate className="icon-lg text-primary" />
            Bole,Fulan Tower
          </div>
        </div>
      </Container>
    </footer>
  );
}
