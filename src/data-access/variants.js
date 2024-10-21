import { db } from "@/db";
import { productVariants, productVariantValues, variants } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function createVariant(values) {
  const [{ id }] = await db
    .insert(variants)
    .values(values)
    .onConflictDoNothing()
    .returning();
  return id;
}

export async function getVariant(id) {
  return await db.query.variants.findFirst({
    where: eq(variants.id, id),
  });
}

export async function getVariantByName(name) {
  return await db.query.variants.findFirst({
    where: eq(variants.name, name),
  });
}

export async function createProductVariant(values) {
  const [{ id }] = await db
    .insert(productVariants)
    .values(values)
    .onConflictDoNothing()
    .returning();
  return id;
}

// export async function getSimilarProductVariant(
//   variantId,
//   productId,
//   variantName
// ) {
//   //! fix this query
//   const variants = await db.query.productVariants.findMany({
//     where: and(
//       eq(productVariants.variantId, variantId),
//       eq(productVariants.productId, productId)
//     ),

//     with: {
//       productVariantValues: true,
//     },
//   });

//   console.log(variants, "vars");
//   const similarVariant = variants.find(
//     (variant) => variant.productVariantValues.name === variantName
//   );
//   return similarVariant;
// }
export async function getSimilarProductVariant(
  variantId,
  productId,
  variantName
) {
  const variants = await db.query.productVariants.findFirst({
    where: and(
      eq(productVariants.variantId, variantId),
      eq(productVariants.productId, productId)
    ),
    columns: {},
    with: {
      productVariantValues: {
        where: eq(productVariantValues.value, variantName),
      },
    },
  });
  //! fix this mess
  if (!variants || !variants.productVariantValues?.length) {
    return false;
  } else {
    return true;
  }
}

export async function getProductVariantById(id) {
  return await db.query.productVariants.findFirst({
    where: eq(productVariants.id, id),
  });
}

export async function getProductVariantValueById(id, value) {
  return await db.query.productVariantValues.findFirst({
    //! multiple productvariant can have same productVariantId, so query on primary key
    where: and(
      eq(productVariantValues.productVariantId, id),
      eq(productVariantValues.value, value)
    ),
    columns: {
      price: true,
      inventory: true,
    },
    with: {
      productVariant: {
        columns: {
          productId: true,
        },
      },
    },
  });
}

export async function createProductVariantValue(values) {
  const [{ id }] = await db
    .insert(productVariantValues)
    .values(values)
    .onConflictDoNothing()
    .returning();
  return id;
}

export async function getAllVariantsName() {
  return await db.query.variants.findMany({
    columns: {
      name: true,
    },
  });
}

export async function getAllProductVariantsNames(id) {
  const result = await db.query.productVariants.findMany({
    where: eq(productVariants.productId, id),
    columns: {},
    with: {
      variant: {
        columns: {
          name: true,
        },
      },
    },
  });

  return result;
}

export async function getAllProductVariants(id) {
  const result = await db.query.productVariants.findMany({
    where: eq(productVariants.productId, id),
    // with: {
    //   variant: {
    //     columns: {
    //       name: true,
    //     },
    //   },
    // },
    columns: {
      id: true,
    },
    with: {
      productVariantValues: {
        columns: {
          value: true,
          price: true,
          inventory: true,
        },
        with: {
          productVariant: {
            columns: {},
            with: {
              variant: {
                columns: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
  console.log(result);
  return result;
}

export async function getAllProductVariantsValues(id) {
  //! fix this to return a variant, e.g color
  return await db.query.productVariantValues.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    // with: {
    //   productVariant: {
    //     where: eq(productVariants.productId, id),
    //     with: {
    //       variant: true,
    //     },
    //   },
    // },
  });
}

export async function deleteProductVariantValue(id) {
  await db
    .delete(productVariantValues)
    .where(eq(productVariantValues.productVariantId, id));
}

export async function deleteProductVariant(id) {
  await db.delete(productVariants).where(eq(productVariants.id, id));
}
