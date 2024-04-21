import AllFilters from "./components/AllFilter";
import EmptyState from "@/components/Products/EmptyState";
import Product from "@/components/Products/Product";
import ProductSkeleton from "@/components/Products/ProductSkeleton";
import type { Product as TProduct } from "@/db";
import { ProductState } from "@/lib/validators/product-validator";
import { Filter } from "lucide-react";
import { QueryResult } from "@upstash/vector";
import AllSort from "./components/AllSort";

const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number];

export const DEFAULT_FILTER_OPTIONS: ProductState = {
  color: ["beige", "blue", "green", "purple", "white"],
  price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
  size: ["L", "M", "S"],
  sort: "none",
};

export default async function Home({
  _params,
  searchParams,
}: {
  _params: { slug: string };
  searchParams: { [key: string]: string };
}) {
  const colorParamValues = searchParams?.color?.split(",");
  const sizeParamValues = searchParams?.size?.split(",");
  const priceParamValues = searchParams?.price?.split(",");
  const sortParamValue = searchParams?.sort;

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
    next: { tags: ['products']},
  });

  const products: QueryResult<TProduct>[] = await request.json();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            High-quality cotton selection
          </h1>

          <div className="flex items-center">
            <AllSort />

            <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <section className="pb-24 pt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <AllFilters />

            {/* Product grid */}
            <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products && products.length === 0 ? (
                <EmptyState />
              ) : products ? (
                products.map((product) => (
                  <Product key={product.id} product={product.metadata!} />
                ))
              ) : (
                new Array(12)
                  .fill(null)
                  .map((_, i) => <ProductSkeleton key={i} />)
              )}
            </ul>
          </div>
        </section>
      </main>
  );
}