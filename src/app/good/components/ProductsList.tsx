"use client";

import { ProductState } from "@/lib/validators/product-validator";
import { QueryResult } from "@upstash/vector";
import type { Product as TProduct } from "@/db";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "@/components/Products/EmptyState";
import Product from "@/components/Products/Product";
import ProductSkeleton from "@/components/Products/ProductSkeleton";

const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number];

export const DEFAULT_FILTER_OPTIONS: ProductState = {
  color: ["beige", "blue", "green", "purple", "white"],
  price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
  size: ["L", "M", "S"],
  sort: "none",
};

function ProductsList() {
  const searchParams = useSearchParams();

  const colorParamValues = searchParams.get("color")?.split(",");
  const sizeParamValues = searchParams.get("size")?.split(",");
  const priceParamValues = searchParams.get("price")?.split(",");
  const sortParamValue = searchParams.get("sort");

  const processedPriceRange =
    priceParamValues && priceParamValues[0] && priceParamValues[1]
      ? [Number(priceParamValues[0]), Number(priceParamValues[1])]
      : DEFAULT_FILTER_OPTIONS.price.range;

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<TProduct>[]>(
        "http://localhost:3000/api/products",
        {
          filter: {
            sort: sortParamValue ? sortParamValue : DEFAULT_FILTER_OPTIONS.sort,
            color: colorParamValues
              ? colorParamValues
              : DEFAULT_FILTER_OPTIONS.color,
            size: sizeParamValues
              ? sizeParamValues
              : DEFAULT_FILTER_OPTIONS.size,
            price: processedPriceRange,
          },
        }
      );

      return data;
    },
  });

  return (
    <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {products && products.length === 0 ? (
        <EmptyState />
      ) : products ? (
        products.map((product) => (
          <Product key={product.id} product={product.metadata!} />
        ))
      ) : (
        new Array(12).fill(null).map((_, i) => <ProductSkeleton key={i} />)
      )}
    </ul>
  );
}

export default ProductsList;