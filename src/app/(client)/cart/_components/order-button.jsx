"use client";
import { LoaderButton } from "@/components/loader-button";
import { orderProductAction } from "../action";
import { useToast } from "@/hooks/use-toast";
import { useCartContext } from "@/providers/cart-context";
import useActionWrapper from "@/lib/action-wrapper";

// const PRODUCT = {
//   id: "cf4e8512-727d-4ec8-a4ff-d74d27c87fcb",
//   productVariantId: "af467bee-0d80-40be-a05c-9194a0ede687",
//   value: "Green",
//   quantity: 2,
// };
export default function OrderButton({
  order: { id, productVariant, quantity },
}) {
  const { addRemoveCartItem } = useCartContext();
  const { toast } = useToast();
  const { execute, isPending } = useActionWrapper(orderProductAction);

  const handleOrder = async () => {
    const params = { id, quantity };
    if (productVariant) {
      (params.value = productVariant.value),
        (params.variantName = productVariant.name),
        (params.productVariantId = productVariant.id);
    }

    const result = await execute(params);
    if (result?.error) {
      toast({
        title: "Uh oh",
        variant: "destructive",
        description: "Something went wrong." + result.error.message,
      });
    } else {
      addRemoveCartItem({ id });
      toast({
        title: "Success",
        description: "Successfully ordered.",
      });
    }
  };
  return (
    <LoaderButton isLoading={isPending} onClick={() => handleOrder()}>
      Order
    </LoaderButton>
  );
}
