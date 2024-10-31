export function ProductVariantDom(variants) {
  let flattendData = variants.map((variant) => {
    if (!variant.productVariantValues.length) {
      return;
    }
    return {
      id: variant.id,
      value: variant.productVariantValues[0].value,
      price: variant.productVariantValues[0].price,
      inventory: variant.productVariantValues[0].inventory,
      variant: variant.productVariantValues[0].productVariant.variant.name,
    };
  });
  flattendData = flattendData.filter((variant) => !!variant);
  return flattendData;
}
