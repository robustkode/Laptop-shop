"use client";
import { LoaderButton } from "@/components/loader-button";
import { orderProductAction } from "../action";
import { useToast } from "@/hooks/use-toast";
import { useCartContext } from "@/providers/cart-context";
import useActionWrapper from "@/lib/action-wrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OrderButton({
  order: { id, productVariant, quantity },
}) {
  const { status } = useSession();
  const { addRemoveCartItem } = useCartContext();
  const { toast } = useToast();
  const { execute, isPending } = useActionWrapper(orderProductAction);
  const router = useRouter();

  const handleOrder = async () => {
    if (status !== "authenticated") {
      router.push("/sign-in?callbackUrl=/cart");
      return;
    }
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
