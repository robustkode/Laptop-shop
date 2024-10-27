import { DeleteButton } from "@/components/delete-button";
import { deleteProductVarianAction } from "../actions";
import { queryClient } from "@/lib/react-query";

export default function DeleteVariantButton({ tobedeltedId, productId }) {
  const handleDelete = async (tobedelted) => {
    const response = await deleteProductVarianAction(tobedelted);
    if (!response || !response.error) {
      queryClient.invalidateQueries(["variants", productId]);
    }
    return response;
  };
  return (
    <DeleteButton
      action={handleDelete}
      tobedeltedID={tobedeltedId}
      successMessage="Successfuly deleted."
      title="Delete a variant"
      description=" Are you sure you want to delete this variant? This action can't be undone!"
      label="Delete"
    />
  );
}
