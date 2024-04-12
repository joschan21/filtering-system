"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createUrl } from "@/lib/utils";

const SIZE_FILTERS = {
  id: "size",
  name: "Size",
  options: [
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
  ],
} as const;

type SizeFilterProps = {
  onChangeAction: () => void
};

const SizeFilter = ({ onChangeAction }: SizeFilterProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
  
    const sizeParam = searchParams.get("size");
    const size = sizeParam ? sizeParam.split(",") : [];
  
    const handleSizeFilterChange = (option: string, checked: boolean) => {
      const optionNameLowerCase = SIZE_FILTERS.name.toLowerCase();
  
      const optionSearchParams = new URLSearchParams(searchParams.toString());
  
      if (checked) {
        const newOptions = [...size, option];
        const filteredOptions = newOptions.join(",");
        optionSearchParams.set(
          optionNameLowerCase,
          decodeURIComponent(filteredOptions)
        );
      } else {
        const newOptions = size.filter((item) => item !== option);
        const filteredOptions = newOptions.join(",");
        if (newOptions.length > 0) {
          optionSearchParams.set(
            optionNameLowerCase,
            decodeURIComponent(filteredOptions)
          );
        } else {
          optionSearchParams.delete(optionNameLowerCase);
        }
      }
  
      const optionUrl = createUrl(pathname, optionSearchParams);
  
      // WHY IT IS BAD? goto 'network' tab in browser you will get it 🤣
      router.replace(optionUrl, { scroll: false }); // this couse  reload and ghost re-fetching
      //window.history.pushState(null, '', optionUrl); // THIS DOESN'T WORK while the bad/page.tsx is client componet aka 'use client'
    };

  return (
    <ul className="space-y-4">
      {SIZE_FILTERS.options.map((option, optionIdx) => (
        <li key={option.value} className="flex items-center">
          <input
            type="checkbox"
            id={`size-${optionIdx}`}
            onChange={(e) => {
                handleSizeFilterChange(option.value, e.target.checked);
                onChangeAction();
            }}
            checked={size.includes(option.value)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor={`size-${optionIdx}`}
            className="ml-3 text-sm text-gray-600"
          >
            {option.label}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default SizeFilter;