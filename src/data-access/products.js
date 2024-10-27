import { EQUALITY, PRICE_RANGE, RAM, STORAGE } from "@/config/constants";
import { db } from "@/db";
import { products, productTags, productVariantValues } from "@/db/schema";
import { and, asc, count, desc, eq, gte, inArray, lte, or } from "drizzle-orm";

export async function createProduct(values) {
  const [{ id }] = await db.insert(products).values(values).returning();
  return id;
}

export async function getProductByName(name) {
  const pr = await db.query.products.findFirst({
    columns: { id: true },
    where: eq(products.name, name),
  });
  return pr;
}

export async function getProductById(id) {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      tags: {
        columns: {
          tagId: true,
          // productId: true,
        },
        with: {
          tag: {
            columns: {
              name: true,
              color: true,
            },
          },
        },
      },
    },
  });
}

export async function deleteProduct(id) {
  await db.delete(products).where(eq(products.id, id));
}

export async function updateProduct(id, values) {
  await db.update(products).set(values).where(eq(products.id, id));
}

export async function fetchProductsPaginated(page, pageSize, order = null) {
  const result = await db.query.products.findMany({
    with: {
      tags: {
        columns: {
          tagId: true,
          productId: true,
        },
        with: {
          tag: {
            columns: {
              name: true,
              color: true,
            },
          },
        },
      },
    },
    orderBy:
      order === "desc"
        ? (products, { desc }) => [desc(products.createdAt)]
        : (products, { asc }) => [asc(products.createdAt)],
    limit: pageSize + 1,
    offset: pageSize * (page - 1),
  });

  const hasNext = result.length === pageSize + 1;
  if (hasNext) result.pop();
  return {
    products: result,
    nextCursor: hasNext ? page + 1 : null,
  };
}

export async function getFiteredProducts({
  sort,
  price,
  condition,
  generation,
  brand,
  ram,
  storageType,
  storage,
  page = 1,
  pageSize = 6,
  updated = true,
}) {
  const conditions = { status: eq(products.status, "active") };
  if (storage) {
    conditions.storage = eq(products.storage, storage);
  }

  //inArray
  if (condition.length) {
    conditions.condition = inArray(products.condition, condition);
  }
  if (generation.length) {
    conditions.generation = inArray(products.generation, generation);
  }
  if (brand.length) {
    conditions.brand = inArray(products.brand, brand);
  }
  if (storageType.length) {
    conditions.storageType = inArray(products.storageType, storageType);
  }

  //range
  if (price) {
    const value = PRICE_RANGE.filter((p) => p.value === price);
    if (value.length) {
      const { upper, lower } = value[0];
      if (upper) {
        conditions.price = and(
          lte(products.rating, upper),
          gte(products.rating, lower)
        );
      } else {
        conditions.price = gte(products.price, lower);
      }
    }
  }

  //other
  if (ram.length) {
    //const value = ram.filter((r) => RAM.some((p) => p.value === r));
    const values = ram
      .map((r) => RAM.find((rm) => rm.value === r))
      .filter((r) => !!r);
    const n = or(
      ...values.map((value) => {
        if (!value.equality) {
          return eq(products.ram, value.value);
        } else if (value.equality === EQUALITY.less) {
          return lte(products.ram, value.value);
        } else {
          return gte(products.ram, value.value);
        }
      })
    );

    const _ = prepareComparisonQuery(ram, RAM, "ram");

   conditions.ram = n;

  }

  //order
  let orderStatement = "";
  if (sort === "str") {
    orderStatement = [desc(products.rating)];
  } else {
    orderStatement = [desc(products.createdAt)];
  }

  const query = db.query.products.findMany({
    // orderBy: [desc(products.createdAt)],
    orderBy: orderStatement,
    limit: pageSize,
    offset: pageSize * (page - 1),
    where: and(...Object.values(conditions)),
    columns: {
      createdAt: false,
      updatedAt: false,
      originalPrice: false,
      status: false,
    },
    with: {
      tags: {
        columns: {},
        with: {
          tag: {
            columns: {
              name: true,
              color: true,
            },
          },
        },
      },
    },
  });

  // query.limit(parseInt(pageSize));
  // query.offset(parseInt(pageSize * (page - 1)));

  // if (Object.keys(conditions).length > 0) {
  //   query.where(and(...Object.values(conditions)));
  // }

  const countQuery = db.select({ count: count(products.id) }).from(products);

  if (Object.keys(conditions).length > 0) {
    countQuery.where(and(...Object.values(conditions)));
  }

  const prds = await query;

  let totalCount;
  if (updated) {
    const countResult = await countQuery;
    totalCount = countResult[0]?.count || 0;
  }

  return {
    data: prds,
    totalCount,
  };
}

export async function updateProductVariantValues(id, values) {
  return await db
    .update(productVariantValues)
    .set(values)
    .where(eq(productVariantValues.productVariantId, id));
}

function prepareComparisonQuery(obj, constant, name) {
  const values = obj
    .map((r) => constant.find((rm) => rm.value === r))
    .filter((r) => !!r);
  const queries = or(
    ...values.map((value) => {
      if (!value.equality) {
        return eq(products[name], value.value);
      } else if (value.equality === EQUALITY.less) {
        return lte(products[name], value.value);
      } else {
        return gte(products[name], value.value);
      }
    })
  );
  return queries;
}

export async function getProducts(column, limit = 6, order = "desc") {
  return await db.query.products.findMany({
    where: eq(products.status, "active"),
    orderBy: [
      order === "desc" ? desc(products[column]) : asc(products[column]),
    ],
    limit: limit,
  });
}

export async function getProductsByTag(tagId, limit = 6) {
  //! return only active products
  let result = await db.query.productTags.findMany({
    where: eq(productTags.tagId, tagId),
    limit: limit,
    columns: {},
    with: {
      product: {
        columns: {
          name: true,
          status: true,
          images: true,
        },
      },
    },
  });

  result = result.filter((_) => _.product.status === "active");
  return result;
}

export async function getProductsCount() {
  const [{ count: c }] = await db
    .select({ count: count(products.id) })
    .from(products);
  return c;
}
