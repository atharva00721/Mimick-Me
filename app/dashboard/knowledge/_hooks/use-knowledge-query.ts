import { useQuery } from "@tanstack/react-query";
import { fetchKnowledge } from "../api";

export const knowledgeQueryKey = ["knowledge"] as const;

export function useKnowledgeQuery() {
  return useQuery({
    queryKey: knowledgeQueryKey,
    queryFn: fetchKnowledge,
  });
}
