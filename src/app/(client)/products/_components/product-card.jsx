import Image from "next/image";
import Link from "next/link";
import OrderButton from "../../cart/_components/order-button";
import { cn } from "@/lib/utils";

const COLOR = {
  blue: "text-blue-500",
  red: "text-red-500",
  yellow: "text-yellow-500",
  green: "text-green-500",
};

export default function ProductCard({
  name,
  description,
  rating,
  brand,
  condition,
  ram,
  storageType,
  storage,
  tags,
  price,
  id,
  productVariants,
  style = "",
  images,
}) {
  return (
    <div className={cn("flex sm:flex-col basis-64 grow gap-4 flex-wrap sm:flex-nowrap", style)}>
      <div className="">
        <Image
          src={images}
          alt="alt"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[100%] object-cover"
          priority
        />
      </div>
      <div>
        <div>
          <Link href={"/products/" + id}>
            <h3 className="header">{name}</h3>
            <p className="whitespace-pre-line">
              <span>{brand} </span>
              <span className="text-muted-foreground">|</span>
              <span>
                {ram}GB <span className="text-muted-foreground">RAM</span>
              </span>
              <span className="text-muted-foreground"> | </span>
              <span>
                {storage}GB -{" "}
                <span className="text-muted-foreground">{storageType} </span>
                <span>{condition}</span>
              </span>
            </p>
            {productVariants ? (
              <div className="flex gap-2">
                <p className="text-muted-foreground">{productVariants.name}:</p>
                <p>{productVariants.value}</p>
              </div>
            ) : (
              ""
            )}

            <div className="flex flex-wrap gap-2">
              {/* {tags.map((tag, i) => (
                <p key={i} className={COLOR[tag.tag.color]}>
                  {tag.tag.name}
                </p>
              ))} */}
            </div>
            <h4 className="font-header text-primary text-lg">
              {price}{" "}
              <span className="text-muted-foreground text-md">Birr</span>
            </h4>
          </Link>
          {/* {cart ? <OrderButton /> : ""} */}
        </div>
      </div>
    </div>
  );
}
