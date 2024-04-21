import { ProductState } from "./validators/product-validator";

export const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number];

export const DEFAULT_FILTER_OPTIONS: ProductState = {
  color: ["beige", "blue", "green", "purple", "white"],
  price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
  size: ["L", "M", "S"],
  sort: "none",
};
