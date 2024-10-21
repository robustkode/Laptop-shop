import DeleteVariantButton from "@/app/admin/variants/[productId]/_components/delete-variant-button";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function VariantsList({ organizedData, id }) {
  return (
    <div className="flex flex-col gap-8">
      {organizedData.map((group) => (
        <div key={group.name} className="">
          <h4 className="font-bold text-lg pb-1">{group.name}</h4>
          <div className="flex gap-12 flex-wrap">
            {group.variants.map((variant) => (
              <div
                className="flex flex-col px-4 py-2 shadow-md"
                key={variant.id}
              >
                <p>
                  <span className="header text-primary-drk">
                    {variant.value}
                  </span>
                </p>
                <p>
                  <span>{variant.price} Birr</span>
                </p>
                <p>
                  {variant.inventory}{" "}
                  <span className="text-muted-foreground">in stock.</span>
                </p>
                {id ? (
                  <DeleteVariantButton
                    tobedeltedId={{ id: variant.id }}
                    productId={id}
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {id ? (
        <Button className="w-fit ">
          <Link href={`/admin/variants/${id}`}>Add variant</Link>
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}
