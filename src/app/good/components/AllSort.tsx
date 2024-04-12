"use client";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import OrderSort from "@/components/Filter/OrderSort";

function AllSort() {
    // Get QueryClient from the context
  const queryClient = useQueryClient();

  const onSubmit = async () => {
    await queryClient.refetchQueries({ queryKey: ["products"], type: 'active' })};
  const debouncedSubmit = debounce(onSubmit, 400);
   const _debouncedSubmit = useCallback(debouncedSubmit, []);
  return (
    <OrderSort onClickAction={_debouncedSubmit} />
  )
}

export default AllSort