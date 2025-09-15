import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../api/api";
import type { Term } from "../../../../types/term";
import type { Collection } from "../../../../types/collection";

export default function useAddTermMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTerm: Term) => {
      await api.post(`collections/${newTerm.id}/terms`, newTerm);
      return newTerm;
    },
    onSuccess: (newTerm) => {
      queryClient.setQueryData<Collection>(
        ["collection-detail", newTerm.collectionId],
        (oldCollection) => {
          if (!oldCollection) return undefined;

          const newTerms = oldCollection.terms
            ? [...oldCollection.terms, newTerm]
            : [newTerm];
          return { ...oldCollection, terms: newTerms };
        }
      );
    },
  });
}
