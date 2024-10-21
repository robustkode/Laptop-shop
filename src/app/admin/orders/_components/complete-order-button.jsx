import React from "react";
import { completeOrderAction } from "../action";
import { queryClient } from "@/lib/react-query";
import useActionWrapper from "@/lib/action-wrapper";
import { LoaderButton } from "@/components/loader-button";
import { useToast } from "@/hooks/use-toast";

export default function CompleteOrderButton({ id }) {
  const { toast } = useToast();
  const { execute, isPending, error, data } =
    useActionWrapper(completeOrderAction);

  const onSubmit = async () => {
    const result = await execute(id);
    if (result?.error) {
      toast({
        title: "Uh oh",
        variant: "destructive",
        description: "Something went wrong." + result.error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Successfuly mark completed.",
      });
      queryClient.invalidateQueries(["admin-orders"]);
    }
  };

  return (
    // <DeleteButton
    //   action={handleDecline}
    //   tobedeltedID={id}
    //   successMessage="Successfuly mark completed."
    //   title="Mark order completed"
    //   description=" Are you sure you want to mark this order completed"
    //   label="Mark completed"
    // />
    <LoaderButton
      variant="outline"
      isLoading={isPending}
      onClick={() => onSubmit()}
    >
      Mark as completed
    </LoaderButton>
  );
}
