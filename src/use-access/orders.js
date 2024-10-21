import {
  createOrder,
  deleteOrder,
  getbrandsShare,
  getMnthlyBuyersNumber,
  getOrderById,
  getOrderMonthlyData,
  getOrderMonthlyRevenue,
  getOrderMonthlySells,
  getTotalMonthlySellandRevenue,
  getUserOrders,
  updateOrder,
} from "@/data-access/orders";
import {
  getProductById,
  updateProduct,
  updateProductVariantValues,
} from "@/data-access/products";
import { getProductVariantValueById } from "@/data-access/variants";
import { assertAuthenticated, assertModerator } from "@/lib/authorization";
import { NotFoundError } from "@/lib/errors";
import { convertUnixToStandardDate, getMonthTimestamps } from "@/lib/time";
import _ from "lodash";

export async function createOrderUseCase(input, user) {
  //const user = await assertAuthenticated();
  const { id, productVariantId, quantity, value, variantName } = input;
  const existingProduct = await getProductById(id);
  if (
    !existingProduct ||
    existingProduct.status !== "active" ||
    existingProduct.inventory === 0
  ) {
    throw new NotFoundError("No product by this id:" + id);
  }

  if (existingProduct.inventory < quantity) {
    throw new NotFoundError("Less product inventory.");
  }

  if (productVariantId) {
    const existingProductVariant = await getProductVariantValueById(
      productVariantId,
      value
    );
    console.log(existingProductVariant.inventory, "here");
    if (
      !existingProductVariant ||
      existingProductVariant.productVariant.productId !== id
    ) {
      throw new NotFoundError("Product not found!");
    }
    if (existingProductVariant.inventory < quantity) {
      throw new NotFoundError("Less product inventory.");
    }

    console.log(existingProductVariant, "pop");
    await createOrder({
      userId: user.id,
      productId: id,
      productVariantId: productVariantId,
      quantity,
      price: existingProductVariant.price,
      value: value,
      variantName,
    });

    await updateProductVariantValues(productVariantId, {
      inventory: existingProductVariant.inventory - quantity,
    });
    await updateProduct(id, {
      inventory: existingProduct.inventory - quantity,
    });
    // return;
    return;
  }

  await createOrder({
    userId: user.id,
    productId: id,
    quantity,
    price: existingProduct.price,
  });

  await updateProduct(id, { inventory: existingProduct.inventory - quantity });
}

export async function getUserOrdersUseCase(userId) {
  //! redundent
  //await assertAuthenticated()
  const orderWithProduct = await getUserOrders(userId);
}

export async function declineOrderUseCase({ id }) {
  await assertModerator();
  const existingOrder = await getOrderById(id);
  if (!existingOrder) {
    throw new NotFoundError("No Order by this id." + id);
  }
  const { quantity, productId, productVariantId, value } = existingOrder;
  const { inventory: productInventory } = await getProductById(productId);
  if (productVariantId) {
    const { inventory: variantInventory } = await getProductVariantValueById(
      productVariantId,
      value
    );
    await updateProductVariantValues(productVariantId, {
      inventory: quantity + variantInventory,
    });
  }
  await updateProduct(productId, { inventory: quantity + productInventory });
  await deleteOrder(id);
}

export async function completeOrderUseCase({ id }) {
  await assertModerator();
  const existingOrder = await getOrderById(id);
  if (!existingOrder) {
    throw new NotFoundError("No Order by this id." + id);
  }

  if (existingOrder.status === "completed") {
    throw new NotFoundError("The order is already completed");
  }
  await updateOrder(id, { status: "completed" });
}

export async function getOrderVolumeUseCase(month) {
  await assertModerator();
  const { start, end, days } = getMonthTimestamps(month);

  const salesData = await getOrderMonthlySells(start, end);
  const revenueData = await getOrderMonthlyRevenue(start, end);

  const combinedData = days.map((day) => {
    const revenue = _.find(revenueData, { date: day });
    const sales = _.find(salesData, { date: day });
    return {
      date: day,
      revenue: revenue ? parseFloat(revenue.revenue) : 0,
      sales: sales ? sales.sales : 0,
    };
  });

  return {
    start: start,
    end: end,
    data: combinedData,
  };
}

export async function getMonthlysStatUseCase(month) {
  await assertModerator();
  const { start, end } = getMonthTimestamps(month, false);
  const { start: lastMonthStart, end: lastMonthEnd } = getMonthTimestamps(
    month + 1
  );

  let brandsShare = [];
  try {
    brandsShare = await getbrandsShare(start, end);
    brandsShare = brandsShare.map((_) => {
      return { ..._, fill: `var(--color-${_.brand})` };
    });
  } catch (_) {}

  const MonthBuyers = await getMnthlyBuyersNumber(start, end);
  const MonthSellandRevenue = await getTotalMonthlySellandRevenue(start, end);

  const LastMonthBuyers = await getMnthlyBuyersNumber(
    lastMonthStart,
    lastMonthEnd
  );
  const lastMonthSellandRevenue = await getTotalMonthlySellandRevenue(
    lastMonthStart,
    lastMonthEnd
  );

  // console.log({
  //   start: start,
  //   end: end,
  //   brandShare: brandsShare,
  //   buyers: MonthBuyers[0].count,
  //   lMBuyers: LastMonthBuyers[0].count,
  //   sandR: MonthSellandRevenue,
  //   lMSandR: lastMonthSellandRevenue,
  // });
  return {
    start: start,
    end: end,
    brandShare: brandsShare,
    buyers: MonthBuyers[0].count,
    lMBuyers: LastMonthBuyers[0].count,
    sandR: MonthSellandRevenue,
    lMSandR: lastMonthSellandRevenue,
  };
}
