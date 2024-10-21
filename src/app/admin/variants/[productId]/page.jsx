import React from "react";
import AddVariantForm from "./_components/add-variant-form";
import {
  getAllProductVariants,
  getAllProductVariantsNames,
  getAllVariantsName,
  getSimilarProductVariant,
} from "@/data-access/variants";
import Container from "@/components/container";
import _ from "lodash";

//! change this to client component and fetch data using react-query
export default async function AddVariant({ params }) {
  const { productId } = params;
  //2! all variants by category
  const allVariantsPromise = getAllVariantsName();

  const allProductVariantsPromise = getAllProductVariantsNames(productId);
  let [allVariantNames, allProductVariantNames] = await Promise.all([
    allVariantsPromise,
    allProductVariantsPromise,
  ]);

  allVariantNames = _.uniq(allVariantNames.map((v) => v.name));
  allProductVariantNames = _.uniq(
    allProductVariantNames.map((v) => v.variant.name)
  );

  // const vario = await getSimilarProductVariant(
  //   "c991bf01-c3c9-45df-afd3-d4d6641d690b",
  //   "729e9f46-77cf-4a62-9f34-08767b687f5f",
  //   "redo"
  // );
  return (
    <main>
      <Container>
        {/* <div>{JSON.stringify(vario)}oops</div> */}
        <h1 className="page-header">
          Create variant for: id: <span>{productId}</span>
        </h1>
        <div className="flex justify-center w-full">
          <div className="basis-96 shrink">
            <AddVariantForm
              productId={productId}
              allvariants={allVariantNames}
              allProductVariants={allProductVariantNames}
            />
          </div>
        </div>
        <div>{JSON.stringify(allVariantNames)}</div>
        <div>{JSON.stringify(allProductVariantNames)}</div>
      </Container>
    </main>
  );
}
