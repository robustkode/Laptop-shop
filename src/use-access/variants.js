import { getProductById, updateProduct } from "@/data-access/products";
import {
  createProductVariant,
  createProductVariantValue,
  createVariant,
  deleteProductVarian,
  deleteProductVariant,
  deleteProductVariantValue,
  getAllProductVariantsNames,
  getProductVariantById,
  getSimilarProductVariant,
  getVariantByName,
} from "@/data-access/variants";
import { assertModerator } from "@/lib/authorization";
import { DuplicateValueError, NotFoundError } from "@/lib/errors";

export default async function createVariantUseCase(input) {
  await assertModerator();
  const existedProduct = await getProductById(input.productId);
  if (!existedProduct) {
    throw new NotFoundError(
      "No product is found with this id: " + input.productId
    );
  }
  let variantId;
  let existedVariant = await getVariantByName(input.name);
  if (!existedVariant) {
    variantId = await createVariant({ name: input.name });
  } else {
    variantId = existedVariant.id;
    //check if there is a product value with the variant id
    const existingProductVariant = await getSimilarProductVariant(
      variantId,
      input.productId,
      input.value
    );

    //! delete instead
    if (existingProductVariant) {
      throw new DuplicateValueError(
        "A simiar product variant already existed. Delete that item first."
      );
    }
  }

  const updatedInventory = existedProduct.inventory + input.inventory;

  await updateProduct(input.productId, { inventory: updatedInventory });
  const productVariantId = await createProductVariant({
    variantId,
    productId: input.productId,
  });

  delete input.productId;
  return await createProductVariantValue({ productVariantId, ...input });
}

export async function deleteProductVarianUseCase(input) {
  await assertModerator();
  const existedProductVariant = await getProductVariantById(input.id);
  if (!existedProductVariant) {
    throw new NotFoundError(
      "No product variant existing with this id" + input.id
    );
  }
  await deleteProductVariantValue(input.id);
  const result = await getAllProductVariantsNames(input.id);
  if (!result || !result.length) {
    await deleteProductVariant(input.id);
  }
}
