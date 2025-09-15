import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../api/api";
import type { Term } from "../../../../types/term";
import type { Collection } from "../../../../types/collection";

export default function useEditTermMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedTerm: Term) => {
      const response = await api.put(
        `/collections/${updatedTerm.collectionId}/terms/${updatedTerm.id}`,
        updatedTerm
      );
      return response.data; // припускаємо, що сервер повертає оновлений термін
    },
    onSuccess: (updatedTerm: Term) => {
      queryClient.setQueryData<Collection>(
        ["collection-detail", updatedTerm.collectionId],
        (oldCollection) => {
          if (!oldCollection) return undefined;

          const updatedTerms = oldCollection.terms!.map((term) =>
            term.id === updatedTerm.id ? updatedTerm : term
          );

          return { ...oldCollection, terms: updatedTerms };
        }
      );
    },
  });
}
