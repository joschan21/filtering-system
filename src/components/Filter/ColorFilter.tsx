"use client";

import { createUrl } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const COLOR_FILTERS = {
  id: "color",
  name: "Color",
  options: [
    { value: "white", label: "White" },
    { value: "beige", label: "Beige" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
  ] as const,
};

type ColorFilterProps = {
  onChangeAction: () => void
}

const ColorFilter = ({ onChangeAction } : ColorFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const colorParam = searchParams.get("color");
  const color = colorParam ? colorParam.split(",") : [];

  const handleColorFilterChange = (option: string, checked: boolean) => {
    const optionNameLowerCase = COLOR_FILTERS.name.toLowerCase();

    const optionSearchParams = new URLSearchParams(searchParams.toString());

    if (checked) {
      const newOptions = [...color, option.toLowerCase()];
      const filteredOptions = newOptions.join(",");
      optionSearchParams.set(
        optionNameLowerCase,
        filteredOptions
      );
    } else {
      const newOptions = color.filter((item) => item.toLowerCase() !== option.toLowerCase());
      const filteredOptions = newOptions.join(",");
      if (newOptions.length > 0) {
        optionSearchParams.set(
          optionNameLowerCase,
          filteredOptions
        );
      } else {
        optionSearchParams.delete(optionNameLowerCase);
      }
    }

    const optionUrl = createUrl(pathname, optionSearchParams);

    //router.replace(optionUrl, { scroll: false }); // this couse  reload and ghost re-fetching
    window.history.pushState(null, '', optionUrl);
  };

  return (
    <ul className="space-y-4">
      {COLOR_FILTERS.options.map((option, optionIdx) => (
        <li key={option.value} className="flex items-center">
          <input
            type="checkbox"
            id={`color-${optionIdx}`}
            onChange={(e) => {
              handleColorFilterChange(option.value, e.target.checked);
              onChangeAction();
            }}
            checked={color.includes(option.value.toLowerCase())}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor={`color-${optionIdx}`}
            className="ml-3 text-sm text-gray-600"
          >
            {option.label}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default ColorFilter;