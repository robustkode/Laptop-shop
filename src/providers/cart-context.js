"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [cartProductVariants, setCartProductVariants] = useState({});

  const addRemoveCartItem = (product) => {
    const isInCart = cartProducts.some((item) => item.id === product.id);
    if (isInCart) {
      setCartProducts(cartProducts.filter((item) => item.id !== product.id));
    } else {
      const productVariants =
        cartProductVariants.productId === product.id
          ? { ...cartProductVariants }
          : null;
      setCartProducts((prevProducts) => [
        ...prevProducts,
        { ...product, productVariants },
      ]);
    }
    setCartProductVariants({});
  };
  // const addRemoveCartItemVariant = (variant) => {
  //   setCartProductVariants((prev) => {
  //     if (prev.productId !== variant.productId) {
  //       return { productId: variant.productId, variants: [variant] };
  //     } else {
  //       const isInCart = prev.variants.some((v) => v.id === variant.id);
  //       if (prev.variants.length === 1) return {};
  //       if (isInCart) {
  //         return {
  //           ...prev,
  //           variants: [...prev.variants.filter((v) => v.id !== variant.id)],
  //         };
  //       }
  //       return { ...prev, variants: [...prev.variants, variant] };
  //     }

  //   });
  // };

  const addRemoveCartItemVariant = (variant) => {
    setCartProductVariants((prev) => {
      //(prev) => {
      // if (prev.productId !== variant.productId) {
      //   return { productId: variant.productId, variants: variant };
      // } else {
      //   const isInCart = prev.variants.some((v) => v.id === variant.id);
      //   if (prev.variants.length === 1) return {};
      //   if (isInCart) {
      //     return {
      //       ...prev,
      //       variants: [...prev.variants.filter((v) => v.id !== variant.id)],
      //     };
      //   }
      //   return { ...prev, variants: [...prev.variants, variant] };
      // }
      //});
      if (prev.id === variant.id) return {};
      else return variant;
    });
  };

  const isInCart = (id) => {
    return cartProducts.some((product) => product.id === id);
  };

  // const isVariantInCart = (productId, variantId) => {
  //   const product = cartProducts.find((p) => p.id === productId);
  //   return product
  //     ? product.productVariants.some((v) => v.id === variantId)
  //     : false;
  // };
  const isVariantInCart = (productId, variantId) => {
    if (cartProductVariants.id === variantId) {
      return true;
    }
    const product = cartProducts.find((p) => p.id === productId);
    return product ? product.productVariants?.id === variantId : false;
  };

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        cartProductVariants,
        addRemoveCartItem,
        isInCart,
        addRemoveCartItemVariant,
        isVariantInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("Context must be used with in a CartContextProvider");
  }
  return context;
}

// const addRemoveCartItem = (product) => {
//   setCartProducts((prevProducts) => {
//     const isInCart = prevProducts.some((item) => item.id === product.id);
//     if (isInCart) {
//       return prevProducts.filter((item) => item.id !== product.id);
//     } else {
//       return [...prevProducts, { ...product, selectedVariants: [] }];
//     }
//   });
// };

// const addRemoveCartItemVariant = (variant) => {
//   setCartProducts((prevProducts) => {
//     const productIndex = prevProducts.findIndex(
//       (product) => product.id === variant.productId
//     );
//     if (productIndex < 0) return prevProducts; // Product not found

//     const product = prevProducts[productIndex];
//     const isVariantInCart = product.selectedVariants.some(
//       (v) => v.id === variant.id
//     );

//     const updatedVariants = isVariantInCart
//       ? product.selectedVariants.filter((v) => v.id !== variant.id)
//       : [...product.selectedVariants, variant];

//     return [
//       ...prevProducts.slice(0, productIndex),
//       { ...product, selectedVariants: updatedVariants },
//       ...prevProducts.slice(productIndex + 1),
//     ];
//   });
// };

// const isInCart = (id) => cartProducts.some((product) => product.id === id);

// const isVariantInCart = (productId, variantId) => {
//   const product = cartProducts.find((p) => p.id === productId);
//   return product
//     ? product.selectedVariants.some((v) => v.id === variantId)
//     : false;
// };
