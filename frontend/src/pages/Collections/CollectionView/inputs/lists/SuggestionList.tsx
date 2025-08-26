import type { Suggestion } from "../../../../../services/collectionService";
import styles from "../Inputs.module.css";

type TermSuggestionContainerParams = {
  termSuggestionList: Suggestion[];
  termSuggestionOnClick: (selectedTerm: string) => void;
};

export default function SuggestionList({
  termSuggestionList,
  termSuggestionOnClick,
}: TermSuggestionContainerParams) {
  return (
    <ul className={styles.termList}>
      {termSuggestionList.map((termS) => (
        <li onClick={() => termSuggestionOnClick(termS.word)}>{termS.word}</li>
      ))}
    </ul>
  );
}
