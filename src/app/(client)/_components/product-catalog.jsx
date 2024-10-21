import Container from "@/components/container";
import Image from "next/image";
import Link from "next/link";

export default function ProductCatalog({ header, products }) {
  return (
    <Container>
      <h2 className="sub-header">{header}</h2>
      <div className="grid sm:grid-cols-3 md:grid-cols-4 grid-cols-2 gap-4 sm:gap-8">
        {products.map((product) => (
          <Link key={product.id} href={"/products/" + product.id}>
            <div>
              <Image
                src="/laptop.jpg"
                width={200}
                height={200}
                alt="product image"
              />
              <h4 className="text-center text-primary hover:underline">
                {product.name}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
