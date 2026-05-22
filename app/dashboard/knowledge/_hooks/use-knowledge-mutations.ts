"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createKnowledge, deleteKnowledge, scrapeWebsite, updateKnowledge } from "../api";
import { CreateKnowledgeInput, ScrapeWebsiteInput, UpdateKnowledgeInput } from "../types";
import { knowledgeQueryKey } from "./use-knowledge-query";

export function useKnowledgeMutations() {
  const queryClient = useQueryClient();

  const invalidateKnowledge = () => queryClient.invalidateQueries({ queryKey: knowledgeQueryKey });

  const addMutation = useMutation({
    mutationFn: (body: CreateKnowledgeInput) => createKnowledge(body),
    onSuccess: invalidateKnowledge,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteKnowledge(id),
    onSuccess: invalidateKnowledge,
  });

  const editMutation = useMutation({
    mutationFn: (body: UpdateKnowledgeInput) => updateKnowledge(body),
    onSuccess: invalidateKnowledge,
  });

  const scrapeMutation = useMutation({
    mutationFn: (body: ScrapeWebsiteInput) => scrapeWebsite(body),
  });

  return {
    addMutation,
    deleteMutation,
    editMutation,
    scrapeMutation,
  };
}
