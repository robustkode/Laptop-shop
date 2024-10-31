"use client";
import { PRICE_RANGE, SORT, STORAGE } from "@/config/constants";
import React, { createContext, useContext, useReducer, useState } from "react";
import _ from "lodash";

import { useSearchParams } from "next/navigation";
import { z } from "zod";

const FilterContext = createContext(null);

const filtersReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_FILTER":
      const { category, value } = action.payload;
      const isFilterApplied = state[category].includes(value);
      return {
        ...state,
        [category]: isFilterApplied
          ? state[category].filter((v) => !_.isEqual(v, value))
          : [...state[category], value],
        page: 1,
        update: true,
      };

    case "REMOVE_FILTER":
      const { category: cat } = action.payload;

      if (Array.isArray(state[cat])) {
        return {
          ...state,
          [cat]: [],
          page: 1,
          update: true,
        };
      } else {
        return {
          ...state,
          [cat]: null,
          page: 1,
          update: true,
        };
      }

    //! ONE case for the three cases
    case "TOGGLE_SORT":
      return {
        ...state,
        sort: action.payload.value,
        page: 1,
        update: true,
      };

    case "TOGGLE_PRICE":
      return {
        ...state,
        price: action.payload.value,
        page: 1,
        update: true,
      };

    case "TOGGLE_STORAGE":
      return {
        ...state,
        storage: action.payload.value,
        page: 1,
        update: true,
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload.page,
        update: false,
      };

    default:
      return state;
  }
};

const schema = z.object({
  // sort: z.union([z.string(z.enum(SORT.map((s) => s.value))), z.null()]),

  price: z.array(z.string()).nullable(),
});

export function FilterContextProvider({ children }) {
  const searchParams = useSearchParams();
  const priceParam = searchParams.get("price");
  const sortParam = searchParams.get("sort");
  const storageParam = searchParams.get("storage");
  const pageParam =
    parseInt(searchParams.get("page")) > 0
      ? parseInt(searchParams.get("page"))
      : 1;
  // const conditionParam = searchParams.get("condition");
  // const brandParam = searchParams.getAll("brand");

  const [filters, dispatch] = useReducer(filtersReducer, {
    sort: SORT.some((s) => s.value === sortParam) ? sortParam : SORT[0].value,
    price: PRICE_RANGE.some((p) => p.value === priceParam) ? priceParam : null,
    //! if brand not in the list mark others
    brand: searchParams.getAll("brand"),
    //! remove all entries not in the lis
    condition: searchParams.getAll("condition"),
    //! generation, ram, storage must be controlled when creating a product
    generation: searchParams.getAll("condition"),
    ram: searchParams.getAll("ram"),
    storageType: searchParams.getAll("storageType"),
    storage: STORAGE.some((st) => st.value === storageParam)
      ? storageParam
      : null,
    page: pageParam,
    update: true,
  });

  return (
    <FilterContext.Provider value={{ filters, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("Context must be used with in a FilterContextProvider");
  }
  return context;
}
