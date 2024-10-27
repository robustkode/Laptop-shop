import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function OrderCard({ order }) {
  const {
    id: productId,
    name,
    brand,
    ram,
    storage,
    storageType,
    condition,
    status,
    showCompleted = false,
    images,
  } = order.product;
  return (
    <div className="flex gap-8 items-center flex-wrap">
      <div className="">
        <Image
          src={images}
          alt="alt"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[100%]  object-cover"
          priority
        />
      </div>
      <div>
        <div>
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
          <h4 className="font-header text-primary text-lg">
            {order.price}
            <span className="text-muted-foreground text-md"> Birr</span>
          </h4>
          {order.productVariantId ? (
            <div>
              <h4 className="font-bold">Variant</h4>
              <div className="flex gap-2">
                <p>{order.variantName}:</p>
                <p className="font-bold">{order.value}</p>
              </div>
            </div>
          ) : (
            ""
          )}
          {showCompleted && status == "completed" ? (
            <div className="bg-green-200 flex gap-2 items-center w-fit rounded-full px-2 py-1 text-green-900 my-1">
              <Check className="icon-sm" />{" "}
              <span className="text-xs">Approved</span>
            </div>
          ) : (
            ""
          )}
          {/* <Link href={"/products/" + productId}>product page</Link> */}
          {/* {cart ? <OrderButton /> : ""} */}
        </div>
      </div>
    </div>
  );
}
