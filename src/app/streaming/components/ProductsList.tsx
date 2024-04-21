import { ProductState } from "@/lib/validators/product-validator";
import { QueryResult } from "@upstash/vector";
import type { Product as TProduct } from "@/db";
import React, { Fragment } from "react";
import EmptyState from "@/components/Products/EmptyState";
import Product from "@/components/Products/Product";

type ProductListProps = {
  DEFAULT_FILTER_OPTIONS: ProductState;
  colorParamValues: string[];
  sizeParamValues: string[];
  sortParamValue: string;
  priceParamValues: string[];
};

const ProductsList = async ({
  DEFAULT_FILTER_OPTIONS,
  colorParamValues,
  sizeParamValues,
  sortParamValue,
  priceParamValues,
}: ProductListProps) => {
  const processedPriceRange =
    priceParamValues && priceParamValues[0] && priceParamValues[1]
      ? [Number(priceParamValues[0]), Number(priceParamValues[1])]
      : DEFAULT_FILTER_OPTIONS.price.range;

  const request = await fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: {
        sort: sortParamValue ? sortParamValue : DEFAULT_FILTER_OPTIONS.sort,
        color: colorParamValues
          ? colorParamValues
          : DEFAULT_FILTER_OPTIONS.color,
        size: sizeParamValues ? sizeParamValues : DEFAULT_FILTER_OPTIONS.size,
        price: processedPriceRange,
      },
    }),
    next: { tags: ["products"] },
  });

  const products: QueryResult<TProduct>[] = await request.json();
  return (
    <Fragment>
      {products && products.length === 0 ? (
        <EmptyState />
      ) : (
        products.map((product) => (
          <Product key={product.id} product={product.metadata!} />
        ))
      )}
    </Fragment>
  );
};

export default ProductsList;
