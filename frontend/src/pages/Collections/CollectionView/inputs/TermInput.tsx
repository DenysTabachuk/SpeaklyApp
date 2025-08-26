import type { Suggestion } from "../../../../services/termService";
import { getTermSuggestion } from "../../../../services/termService";
import SuggestionList from "./lists/SuggestionList";
import Input from "../../../../components/Inputs/Input";
import { useState } from "react";
import { useHttp } from "../../../../hooks/useHttp";

type TermInputProps = {
  term: string;
  fetchDefinitions: (term: string) => void;
};

export default function TermInput({ term, fetchDefinitions }: TermInputProps) {
  const [newTerm, setNewTerm] = useState(term || "");
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
        <SuggestionList
          termSuggestionList={suggestions}
          termSuggestionOnClick={handleSuggestionSelect}
        />
      )}
    </div>
  );
}
