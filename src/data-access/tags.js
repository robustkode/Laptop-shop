import { db } from "@/db";
import { productTags, tags } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";

export async function createTags(values) {
  const creatdTags = await db
    .insert(tags)
    .values(values)
    .onConflictDoNothing({ target: tags.name })
    .returning();
  //! ewmove this
  if (!creatdTags.length) {
    const existingTags = await db.query.tags.findFirst({
      where: eq(tags.name, values.name),
    });
    return [existingTags];
  }
  return creatdTags;
}

export async function createProductTags(values) {
  const creatdTags = await db
    .insert(productTags)
    .values(values)
    .onConflictDoNothing()
    .returning();
  return creatdTags;
}

export async function getTags() {
  return await db.query.tags.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
}

export async function getProductTags(id) {
  const prodTags = await db.query.productTags.findMany({
    columns: {
      id: true,
    },
    with: {
      tag: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    where: eq(productTags.productId, id),
  });
  const modifedProducts = prodTags.map((tag) => tag.tag);
  return modifedProducts;
}

export async function removeProductTags(id, tags) {
  await db
    .delete(productTags)
    .where(
      or(
        ...tags.map((t) =>
          and(eq(productTags.productId, id), eq(productTags.tagId, t.id))
        )
      )
    );
}

export async function removeAllTags(id) {
  await db.delete(productTags).where(eq(productTags.productId, id));
}

export async function getTagByname(name) {
  return await db.query.tags.findFirst({
    where: eq(tags.name, name),
  });
}
