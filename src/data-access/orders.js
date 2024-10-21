import { db } from "@/db";
import { productOrders, products, productVariantValues } from "@/db/schema";
import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  lt,
  lte,
  sql,
  sum,
} from "drizzle-orm";
import { groupBy } from "lodash";

export async function createOrder(values) {
  const createdOrder = await db
    .insert(productOrders)
    .values(values)
    .onConflictDoNothing()
    .returning();
  return createdOrder;
}

export async function getUserOrders(userId) {
  return await db.query.productOrders.findMany({
    where: eq(productOrders.userId, userId),
    orderBy: [desc(productOrders.createdAt)],
    with: {
      product: {
        columns: {
          description: false,
          originalPrice: false,
          price: false,
          createdAt: false,
          updatedAt: false,
          inventory: false,
          rating: false,
          status: false,
        },
      },
    },
    // with: { productVariantValues: true },
  });
  // return await db.select(productOrders).from(productOrders);
}

export async function fetchOrdersPaginated(
  page,
  pageSize = 8,
  order = null,
  status
) {
  const result = await db.query.productOrders.findMany({
    where: eq(productOrders.status, status),
    orderBy: [desc(productOrders.createdAt)],
    limit: pageSize + 1,
    offset: pageSize * (page - 1),
    with: {
      product: {
        columns: {
          description: false,
          createdAt: false,
          updatedAt: false,
          rating: false,
          status: false,
        },
      },
    },
  });
  const hasNext = result.length === pageSize + 1;
  if (hasNext) result.pop();
  return {
    products: result,
    nextCursor: hasNext ? page + 1 : null,
  };
}

export async function deleteOrder(id) {
  await db.delete(productOrders).where(eq(productOrders.id, id));
}

export async function getOrderById(id) {
  return await db.query.productOrders.findFirst({
    where: eq(productOrders.id, id),
  });
}

export async function updateOrder(id, values) {
  await db.update(productOrders).set(values).where(eq(productOrders.id, id));
}

export async function getOrderMonthlySells(start, end) {
  return await db
    .select({
      sales: count(productOrders.id),
      // date: sql`STRFTIME('%m-%Y', ${productOrders.createdAt})`,
      // date: sql`STRFTIME('%d-%m-%Y', ${productOrders.createdAt}, 'unixepoch')`,
      date: productOrders.createdDay,
    })
    .from(productOrders)
    .where(
      and(
        eq(productOrders.status, "completed"),
        gte(productOrders.createdAt, start),
        lte(productOrders.createdAt, end)
      )
    )
    .groupBy(productOrders.createdDay);
  // .groupBy(sql`STRFTIME('%d-%m-%Y', ${productOrders.createdAt} )`);
  // .groupBy(
  //   sql`STRFTIME('%d-%m-%Y', datetime(creatdAt/1000, 'unixepoch', 'localtime')) productOrders`
  // );
}

export async function getOrderMonthlyRevenue(start, end) {
  return await db
    .select({
      revenue: sum(productOrders.price),
      date: productOrders.createdDay,
    })
    .from(productOrders)
    .where(
      and(
        eq(productOrders.status, "completed"),
        gte(productOrders.createdAt, start),
        lte(productOrders.createdAt, end)
      )
    )
    .groupBy(productOrders.createdDay);
}

export async function getTotalMonthlySellandRevenue(start, end) {
  return await db
    .select({
      revenue: sum(productOrders.price),
      sales: sum(productOrders.quantity),
    })
    .from(productOrders)
    .where(
      and(
        // eq(productOrders.status, "completed"),
        gte(productOrders.createdAt, start),
        lte(productOrders.createdAt, end)
      )
    );
}

export async function getbrandsShare(start, end) {
  return await db
    .select({
      brand: products.brand,
      count: count(productOrders.id),
    })
    .from(productOrders)
    .leftJoin(products, eq(productOrders.productId, products.id))
    .where(
      and(
        // eq(productOrders.status, "completed"),
        gte(productOrders.createdAt, start),
        lte(productOrders.createdAt, end)
      )
    )
    .groupBy(products.brand);
}

export async function getMnthlyBuyersNumber(start, end) {
  return await db
    .select({
      count: countDistinct(productOrders.userId),
    })
    .from(productOrders)
    .where(
      and(
        // eq(productOrders.status, "completed"),
        gte(productOrders.createdAt, start),
        lte(productOrders.createdAt, end)
      )
    );
}
