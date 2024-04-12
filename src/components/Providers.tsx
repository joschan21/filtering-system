"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const client = new QueryClient();

const Providers = ({ children }: PropsWithChildren<{}>) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default Providers;

// TODO: SSR for TenStack Query
// source - https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr