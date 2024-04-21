"use client";
import { useCallback } from "react";
import debounce from "lodash.debounce";
import OrderSort from "@/components/Filter/OrderSort";
import { revalidateProducts } from "../actions/revalidate";

function AllSort() {
  const onSubmit = () => revalidateProducts();
  const debouncedSubmit = debounce(onSubmit, 400);
  const _debouncedSubmit = useCallback(debouncedSubmit, []);

  return (
    <OrderSort onClickAction={_debouncedSubmit} />
  )
}

export default AllSort