import {
  createProduct,
  getProductById,
  getProductByName,
  getProductsByTag,
  updateProduct,
} from "@/data-access/products";
import {
  createProductTags,
  createTags,
  getProductTags,
  getTagByname,
  removeAllTags,
  removeProductTags,
} from "@/data-access/tags";
import { assertModerator } from "@/lib/authorization";
import { NotFoundError, PublicError } from "@/lib/errors";
import { compare } from "@/lib/utils";
import { partition } from "lodash";

export async function createProductUseCase({ input, newTags, existingTags }) {
  //await assertModerator();
  const productWithSameName = await getProductByName(input.name);

  if (productWithSameName) {
    throw new PublicError("Product existed with same name");
  }
  const productId = await createProduct(input);
  let createdTags = [];

  if (newTags) {
    try {
      const inputTags = newTags.map((v) => {
        return {
          name: v.name,
        };
      });
      createdTags = await createTags(inputTags);
    } catch (_) {
      console.log(_);
    }
  }
  const allTags = existingTags
    ? [...createdTags, ...existingTags]
    : [...createdTags];
  if (allTags.length) {
    try {
      const inputTags = allTags.map((v) => {
        return { productId: productId, tagId: v.id };
      });
      await createProductTags(inputTags);
    } catch (_) {}
  }

  return productId;
}

export async function deleteProductUseCase(id) {
  //await assertModerator();
  const productWithSameName = await getProductByName(id);

  if (!productWithSameName) {
    throw new PublicError("Product doesn't exist.");
  }
  await deleteProductUseCase(id);
}

export async function updateProductUseCase({ input, newTags, existingTags }) {
  await assertModerator();
  const { id: productId, ...restInput } = input;
  const productWithSameName = await getProductById(productId);
  if (!productWithSameName) {
    throw new PublicError("No product is existed with this id: ");
  }

  //! the inventory of the product must be grater than sum of inventory of variants
  await updateProduct(productId, restInput);
  const productTags = (await getProductTags(productId)) || [];
  let addedTags = [];

  if (existingTags && existingTags.length) {
    const { addedItems, removedItems } = compare(productTags, existingTags);
    addedTags = [...addedItems];
    if (removedItems.length) {
      await removeProductTags(productId, removedItems);
    }
  } else {
    await removeAllTags(productId);
  }
  let createdTags = [];
  if (newTags && newTags.length) {
    createdTags = await createTags(
      newTags.map((t) => {
        return { name: t.name };
      })
    );
  }

  const allNewProdcutTags = [...addedTags, ...createdTags] || [];

  if (allNewProdcutTags.length) {
    await createProductTags(
      allNewProdcutTags.map((t) => {
        return { productId: productId, tagId: t.id };
      })
    );
  }
}

export async function getProductsWithTagUseCase(input) {
  const { name } = input;
  const existingTag = await getTagByname(name);

  if (!existingTag) {
    return [];
    // throw new NotFoundError("No product with this tag: " + name);
  }

  return await getProductsByTag(existingTag.id, input.limit);
}
