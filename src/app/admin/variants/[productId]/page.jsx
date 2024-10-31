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

export const dynamic = "force-dynamic";

export default async function AddVariant({ params }) {
  const { productId } = params;

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

  return (
    <main>
      <Container className={"my-12 text-xl"}>
        {/* <div>{JSON.stringify(vario)}oops</div> */}
        <h1 className="font-bold pb-4">
          Variant for id: <span className="font-normal">{productId}</span>
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
