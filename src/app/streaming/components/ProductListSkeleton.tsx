import ProductSkeleton from "@/components/Products/ProductSkeleton";
import React, { Fragment } from "react";

function ProductListSkeleton() {
  return (
    <Fragment>
      {new Array(12).fill(null).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </Fragment>
  );
}

export default ProductListSkeleton;
