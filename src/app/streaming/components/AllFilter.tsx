"use client";
import { Fragment, useCallback } from "react";
import debounce from "lodash.debounce";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import ColorFilter from "@/components/Filter/ColorFilter";
import PriceFilter from "@/components/Filter/PriceFilter";
import SizeFilter from "@/components/Filter/SizeFilter";
import { revalidateProducts } from "../actions/revalidate";

const SUBCATEGORIES = [
  { name: "T-Shirts", selected: true, href: "#" },
  { name: "Hoodies", selected: false, href: "#" },
  { name: "Sweatshirts", selected: false, href: "#" },
  { name: "Accessories", selected: false, href: "#" },
];

const AllFilters = () => {
  const onSubmit = () => revalidateProducts();
  const debouncedSubmit = debounce(onSubmit, 400);
  const _debouncedSubmit = useCallback(debouncedSubmit, []);

  return (
    <Fragment>
      <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
        {SUBCATEGORIES.map((category) => (
          <li key={category.name}>
            <button
              disabled={!category.selected}
              className="disabled:cursor-not-allowed disabled:opacity-60"
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>

      <Accordion type="multiple" className="animate-none">
        {/* Color filter */}
        <AccordionItem value="color">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Color</span>
          </AccordionTrigger>

          <AccordionContent className="pt-6 animate-none">
            <ColorFilter onChangeAction={_debouncedSubmit} />
          </AccordionContent>
        </AccordionItem>

        {/* Size filters */}
        <AccordionItem value="size">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Size</span>
          </AccordionTrigger>

          <AccordionContent className="pt-6 animate-none">
            <SizeFilter onChangeAction={_debouncedSubmit} />
          </AccordionContent>
        </AccordionItem>

        {/* Price filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Price</span>
          </AccordionTrigger>

          <AccordionContent className="pt-6 animate-none">
            <PriceFilter onChangeAction={_debouncedSubmit} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Fragment>
  );
};

export default AllFilters;
