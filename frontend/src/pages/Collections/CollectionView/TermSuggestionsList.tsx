import type { Suggestion } from "./CollectionView";
import styles from "./CollectionView.module.css";

type TermSuggestionContainerParams = {
  termSuggestionList: Suggestion[];
  termSuggestionOnClick: (selectedTerm: string) => void;
};

export default function TermSuggestionList({
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
