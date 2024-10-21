import { DeleteButton } from "@/components/delete-button";
import React from "react";
import { declineOrderAction } from "../action";
import { queryClient } from "@/lib/react-query";

export default function DeclineOrderButton({ id }) {
  const handleDecline = async (tobedelted) => {
    const response = await declineOrderAction(tobedelted);
    if (!response || !response.error) {
      queryClient.invalidateQueries(["admin-orders"]);
    }
    return response;
  };
  return (
    <DeleteButton
      action={handleDecline}
      tobedeltedID={id}
      successMessage="Successfuly Declied."
      title="Decline order"
      description=" Are you sure you want to decline this order? This action can't be undone!"
      label="Decline"
    />
  );
}
