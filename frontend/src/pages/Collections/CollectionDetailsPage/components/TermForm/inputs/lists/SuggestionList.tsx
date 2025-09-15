import type { Suggestion } from "../../../../../../../types/suggestion";
import styles from "../Inputs.module.css";
import showMoreIcon from "../../../../../../../assets/show-more-icon.png";
import { useState, useRef, useEffect } from "react";

type TermSuggestionContainerParams = {
  termSuggestionList: Suggestion[];
  termSuggestionOnClick: (selectedTerm: string) => void;
  termIsEntered: boolean;
};

export default function SuggestionList({
  termSuggestionList,
  termSuggestionOnClick,
  termIsEntered,
}: TermSuggestionContainerParams) {
  const [showMore, setShowMore] = useState(true);
  const [hideCompletely, setHideCompletely] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (listRef.current) {
      setMaxHeight(showMore ? listRef.current.scrollHeight : 0);
    }
  }, [showMore, termSuggestionList]);

  // Анімація зникнення після вибору
  useEffect(() => {
    if (termIsEntered) {
      setShowMore(false);
      const timeout = setTimeout(() => setHideCompletely(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [termIsEntered]);

  // Показати список знову, якщо користувач редагує текст
  useEffect(() => {
    if (!termIsEntered) {
      setHideCompletely(false);
      setShowMore(true);
    }
  }, [termIsEntered]);

  const handleClickItem = (word: string) => {
    termSuggestionOnClick(word);
  };

  if (termSuggestionList.length === 0 || hideCompletely) return null;

  return (
    <div>
      {!termIsEntered && (
        <div
          className={styles.showMoreIconContainer}
          onClick={() => setShowMore(!showMore)}
        >
          <img
            src={showMoreIcon}
            className={`icon ${styles.showMoreIcon} ${
              !showMore ? styles.closed : ""
            }`}
            alt=""
          />
        </div>
      )}

      <ul
        ref={listRef}
        className={styles.termList}
        style={{
          maxHeight: maxHeight,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {termSuggestionList.map((termS) => (
          <li key={termS.word} onClick={() => handleClickItem(termS.word)}>
            {termS.word}
          </li>
        ))}
      </ul>
    </div>
  );
}
