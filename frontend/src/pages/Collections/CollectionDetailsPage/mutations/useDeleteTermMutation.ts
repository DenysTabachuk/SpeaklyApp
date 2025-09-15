import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../api/api";
import type { Term } from "../../../../types/term";
import type { Collection } from "../../../../types/collection";

export default function useDeleteTermMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (termToDelete: Term) => {
      await api.delete(
        `/collections/${termToDelete.collectionId}/terms/${termToDelete.id}`
      );
    },
    onSuccess: (_, termToDelete: Term) => {
      queryClient.setQueryData<Collection>(
        ["collection-detail", termToDelete.collectionId],
        (oldCollection) => {
          if (!oldCollection) return undefined;
          const updatedTerms = oldCollection.terms!.filter(
            (term) => term.id !== termToDelete.id
          );
          return { ...oldCollection, terms: updatedTerms };
        }
      );
    },
  });
}
