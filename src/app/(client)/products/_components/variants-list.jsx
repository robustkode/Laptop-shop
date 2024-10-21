"use client";

import ErrorMessage from "@/components/error-message";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useCartContext } from "@/providers/cart-context";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useMemo } from "react";

const getProductVariants = (id) => {
  return apiClient.get("/variants/" + id);
};

export function ProductVariants({ id }) {
  const {
    addRemoveCartItemVariant,
    isVariantInCart,
    cartProducts,
    cartProductVariants,
  } = useCartContext();
  const { data, isError, isPending, error, refetch } = useQuery({
    queryKey: ["variants", id],
    queryFn: async () => await getProductVariants(id),
  });

  const organizedData = useMemo(() => {
    if (data && data.length) {
      // Group by variant name
      const groupedData = _.chain(data)
        .groupBy("variant")
        .map((variants, name) => ({
          name,
          variants: variants.map(({ id, value, price, inventory }) => ({
            id,
            value,
            price,
            inventory,
            name,
          })),
        }))
        .value();

      return groupedData;
    }
    return [];
  }, [data]);

  return (
    <div className="flex flex-wrap">
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <ErrorMessage
          error={error.message}
          retry={refetch}
          className={"w-full"}
        />
      ) : (
        <div className="w-full">
          <div className="flex flex-col gap-8">
            {organizedData.map((group) => (
              <div key={group.name} className="">
                <h4 className="header text-xl pb-1">{group.name}</h4>
                <div className="flex gap-12 flex-wrap cursor-pointer">
                  {group.variants.map((variant) => (
                    <div
                      className={cn(
                        {
                          "border border-primary": isVariantInCart(
                            id,
                            variant.id
                          ),
                        },
                        "flex flex-col px-4 py-2 shadow-md rounded-sm"
                      )}
                      key={variant.id}
                      onClick={() =>
                        addRemoveCartItemVariant({
                          ...variant,
                          productId: id,
                        })
                      }
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
