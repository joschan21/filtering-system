"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from "lucide-react";
import React from "react";
import { cn, createUrl } from "@/lib/utils";

const ORDER_SORT = {
  id: 'sort',
  name: 'Sort',
  options: [
    { name: "None", value: "none" },
    { name: "Price: Low to High", value: "price-asc" },
    { name: "Price: High to Low", value: "price-desc" },
  ] as const
}

type OrderSortProps = {
  onClickAction: () => void
}

const OrderSort = ({ onClickAction }: OrderSortProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const orderParam = searchParams.get("sort");

  const handleSortClick = (option: string) => {
    const optionNameLowerCase = ORDER_SORT.name.toLowerCase();

    const optionSearchParams = new URLSearchParams(searchParams.toString());

    if(option === 'none') {
      optionSearchParams.delete(optionNameLowerCase)
    }else {
      optionSearchParams.set(optionNameLowerCase, option)
    }

    const optionUrl = createUrl(pathname, optionSearchParams);

    // WHY IT IS BAD? goto 'network' tab in browser you will get it 🤣
    router.replace(optionUrl, { scroll: false }); // this couse  reload and ghost re-fetching
    //window.history.pushState(null, '', optionUrl); // THIS DOESN'T WORK while the bad/page.tsx is client componet aka 'use client'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
        Sort
        <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {ORDER_SORT.options.map((option) => (
          <button
            key={option.name}
            className={cn("text-left w-full block px-4 py-2 text-sm", {
              "text-gray-900 bg-gray-100": option.value === orderParam,
              "text-gray-500": option.value !== orderParam,
            })}
            onClick={() => {
              handleSortClick(option.value)
              onClickAction();
            }}
          >
            {option.name}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderSort;
