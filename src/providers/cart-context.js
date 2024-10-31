"use client";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartContextProvider({ children }) {
  const { getItem, setItem } = useLocalStorage("fulan-cart-product");
  const { getItem: getVariant, setItem: setVarinat } =
    useLocalStorage("fulan-cart-product");

  const [cartProducts, setCartProducts] = useState([]);
  const [cartProductVariants, setCartProductVariants] = useState({});

  useEffect(() => {
    const storedProducts = getItem();
    const storedVariants = getVariant();

    if (storedProducts) {
      setCartProducts(storedProducts);
    }

    if (storedVariants) {
      setCartProductVariants(storedVariants);
    }
  }, []);

  const addRemoveCartItem = (product) => {
    const isInCart = cartProducts.some((item) => item.id === product.id);
    if (isInCart) {
      setCartProducts((_) => {
        const newVal = cartProducts.filter((item) => item.id !== product.id);
        setItem(newVal);
        return newVal;
      });
    } else {
      const productVariants =
        cartProductVariants.productId === product.id
          ? { ...cartProductVariants }
          : null;
      setCartProducts((prevProducts) => {
        const newVal = [...prevProducts, { ...product, productVariants }];
        setItem(newVal);
        return newVal;
      });
    }
    setCartProductVariants({});
    setVarinat({});
  };

  const addRemoveCartItemVariant = (variant) => {
    setCartProductVariants((prev) => {
      let newVal = variant;
      if (prev.id === variant.id) newVal = {};
      setVarinat(variant);
      return variant;
    });
  };

  const isInCart = (id) => {
    return cartProducts.some((product) => product.id === id);
  };
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
