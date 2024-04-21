import AllFilters from "./components/AllFilter";
import { ProductState } from "@/lib/validators/product-validator";
import { Filter } from "lucide-react";
import AllSort from "./components/AllSort";
import ProductsList from "./components/ProductsList";
import { Suspense } from "react";
import ProductListSkeleton from "./components/ProductListSkeleton";

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
          <div className="hidden lg:block">
            <AllFilters />
          </div>

          {/* Product grid */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductsList
                DEFAULT_FILTER_OPTIONS={DEFAULT_FILTER_OPTIONS}
                colorParamValues={colorParamValues}
                sizeParamValues={sizeParamValues}
                priceParamValues={priceParamValues}
                sortParamValue={sortParamValue}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
