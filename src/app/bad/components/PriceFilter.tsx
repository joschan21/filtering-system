"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Slider } from "@/components/ui/slider";
import { cn, createUrl } from "@/lib/utils";

const PRICE_FILTERS = {
  id: "price",
  name: "Price",
  options: [
    { value: [0, 100], label: "Any price" },
    {
      value: [0, 20],
      label: "Under 20€",
    },
    {
      value: [0, 40],
      label: "Under 40€",
    },
    // custom option defined in JSX
  ],
} as const;

const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number];

type PriceFilterProps = {
  onChangeAction: () => void;
};

function PriceFilter({ onChangeAction }: PriceFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const priceParam = searchParams.get("price");
  const price = priceParam ? priceParam.split(",") : [];

  const isCustom = price.includes("custom");

  const priceStartRange = price[0] ? Number(price[0]) : DEFAULT_CUSTOM_PRICE[0];
  const priceEndRange = price[1] ? Number(price[1]) : DEFAULT_CUSTOM_PRICE[1];

  const minPrice = Math.min(priceStartRange, priceEndRange);
  const maxPrice = Math.max(priceStartRange, priceEndRange);

  const handlePriceChange = (range: [number, number], isCustom: boolean) => {
    const optionNameLowerCase = PRICE_FILTERS.name.toLowerCase();
    const optionSearchParams = new URLSearchParams(searchParams.toString());

    if (isCustom) {
      const filteredOptions = [...range, "custom"].join(",");
      optionSearchParams.set(
        optionNameLowerCase,
        decodeURIComponent(filteredOptions)
      );
    } else {
      const filteredOptions = [...range, "raw"].join(",");
      optionSearchParams.set(
        optionNameLowerCase,
        decodeURIComponent(filteredOptions)
      );
    }

    const optionUrl = createUrl(pathname, optionSearchParams);

    // WHY IT IS BAD? goto 'network' tab in browser you will get it 🤣
    router.replace(optionUrl, { scroll: false }); // this couse  reload and ghost re-fetching
    //window.history.pushState(null, '', optionUrl); // THIS DOESN'T WORK while the bad/page.tsx is client componet aka 'use client'
  };

  return (
    <ul className="space-y-4">
      {PRICE_FILTERS.options.map((option, optionIdx) => (
        <li key={option.label} className="flex items-center">
          <input
            type="radio"
            id={`price-${optionIdx}`}
            onChange={() => {
              handlePriceChange(option.value as never, false);   
              onChangeAction();
            }}
            checked={
              !isCustom &&
              priceStartRange === option.value[0] &&
              priceEndRange === option.value[1]
            }
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor={`price-${optionIdx}`}
            className="ml-3 text-sm text-gray-600"
          >
            {option.label}
          </label>
        </li>
      ))}
      <li className="flex justify-center flex-col gap-2">
        <div>
          <input
            type="radio"
            id={`price-${PRICE_FILTERS.options.length}`}
            onChange={() => {
              handlePriceChange(DEFAULT_CUSTOM_PRICE, true);
              onChangeAction();
            }}
            checked={isCustom}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor={`price-${PRICE_FILTERS.options.length}`}
            className="ml-3 text-sm text-gray-600"
          >
            Custom
          </label>
        </div>

        <div className="flex justify-between">
          <p className="font-medium">Price</p>
          <div>
            {isCustom ? minPrice.toFixed(0) : priceStartRange.toFixed(0)} € -{" "}
            {isCustom ? maxPrice.toFixed(0) : priceEndRange.toFixed(0)} €
          </div>
        </div>

        <Slider
          className={cn({
            "opacity-50": !isCustom,
          })}
          disabled={!isCustom}
          onValueChange={(range) => {
            const [newMin, newMax] = range;

            handlePriceChange([newMin, newMax], true);
            onChangeAction();
          }}
          value={
            isCustom ? [priceStartRange, priceEndRange] : DEFAULT_CUSTOM_PRICE
          }
          min={DEFAULT_CUSTOM_PRICE[0]}
          defaultValue={DEFAULT_CUSTOM_PRICE}
          max={DEFAULT_CUSTOM_PRICE[1]}
          step={5}
        />
      </li>
    </ul>
  );
}

export default PriceFilter;
