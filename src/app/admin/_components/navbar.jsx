import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="bg-primary-bg py-4">
      <Container as="div">
        <ul className="flex flex-wrap">
          <li>
            <Button variant="link" className="text-foreground text-md">
              <Link href="/admin">Stat</Link>
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-foreground text-md">
              <Link href="/admin/products">Products</Link>
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-foreground text-md">
              <Link href="/admin/orders">Orders</Link>
            </Button>
          </li>
        </ul>
      </Container>
    </nav>
  );
}
