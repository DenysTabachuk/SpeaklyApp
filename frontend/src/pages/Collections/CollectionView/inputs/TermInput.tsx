import type { Suggestion } from "../../../../services/termCollectionsService";
import { getTermSuggestion } from "../../../../services/termCollectionsService";
import TermSuggestionList from "../lists/TermSuggestionsList";
import Input from "../../../../components/Inputs/Input";
import { useState } from "react";
import { useHttp } from "../../../../hooks/useHttp";

type TermInputProps = {
  fetchDefinitions: (term: string) => void;
};

export default function TermInput({ fetchDefinitions }: TermInputProps) {
  const [newTerm, setNewTerm] = useState("");
  const [termIsEntered, setTermIsEntered] = useState(false);

  const {
    data: suggestions,
    isLoading: isLoadingSuggestions,
    error: errorSuggestion,
    execute: fetchSuggestions,
  } = useHttp<Suggestion[], [string]>(getTermSuggestion);

  const handleTermInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const term = event.target.value;
    setNewTerm(term);
    setTermIsEntered(false);
    fetchSuggestions(term);
  };

  const handleSuggestionSelect = (selectedTerm: string) => {
    setNewTerm(selectedTerm);
    setTermIsEntered(true);
    fetchDefinitions(selectedTerm);
  };

  return (
    <div>
      <Input
        label="Термін"
        onChange={handleTermInputChange}
        value={newTerm}
        name="term"
      />
      {suggestions && !termIsEntered && (
        <TermSuggestionList
          termSuggestionList={suggestions}
          termSuggestionOnClick={handleSuggestionSelect}
        />
      )}
    </div>
  );
}
