import type { Suggestion } from "../../../../../../types/suggestion";
import SuggestionList from "./lists/SuggestionList";
import Input from "../../../../../../components/Inputs/Input";
import { useState } from "react";
import api from "../../../../../../api/api";

type TermInputProps = {
  term: string;
  fetchDefinitions: (term: string) => void;
};

export default function TermInput({ term, fetchDefinitions }: TermInputProps) {
  const [newTerm, setNewTerm] = useState(term || "");
  const [termIsEntered, setTermIsEntered] = useState(false);
  const [suggestions, setSuggestion] = useState<Suggestion[] | null>(null);

  const handleTermInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const term = event.target.value;
    setNewTerm(term);
    setTermIsEntered(false);
    const suggestions = await api.get<Suggestion[]>(
      `https://api.datamuse.com/sug?s=${term}`
    );
    setSuggestion(suggestions.data);
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
        autoComplete="off"
      />

      <SuggestionList
        termSuggestionList={suggestions || []}
        termSuggestionOnClick={handleSuggestionSelect}
        termIsEntered={termIsEntered}
      />
    </div>
  );
}
