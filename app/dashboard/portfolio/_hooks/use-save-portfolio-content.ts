"use client";

import { useMutation } from "@tanstack/react-query";
import type { PortfolioContent } from "../../actions";

export function useSavePortfolioContent() {
  return useMutation({
    mutationFn: async (nextContent: PortfolioContent) => {
      const { updatePortfolioContent } = await import("@/app/dashboard/actions");
      await updatePortfolioContent(nextContent);
    },
  });
}
