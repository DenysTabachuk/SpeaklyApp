import type { Definition } from "../../../../../../../types/definition";
import styles from "../Inputs.module.css";
import showMoreIcon from "../../../../../../../assets/show-more-icon.png";
import { useState } from "react";

type DefinitionListProps = {
  definitionIndex: number;
  definitionText: string;
  definitionsList: Definition[];
  definitionOnClick: (index: number, def: string) => void;
};

export default function DefinitionList({
  definitionIndex,
  definitionText,
  definitionsList,
  definitionOnClick,
}: DefinitionListProps) {
  const [showMore, setShowMore] = useState(true);

  // Фільтруємо по підрядку (case-insensitive)
  const filteredDefinitions = definitionsList.filter((def) =>
    def.text.toLowerCase().includes(definitionText.toLowerCase())
  );

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleClickItem = (defText: string) => {
    definitionOnClick(definitionIndex, defText);
    setShowMore(false); // сховати список після вибору
  };

  return (
    <div>
      {filteredDefinitions.length > 0 && (
        <div className={styles.showMoreIconContainer} onClick={handleShowMore}>
          <img
            src={showMoreIcon}
            className={`icon ${styles.showMoreIcon} ${
              !showMore ? styles.closed : ""
            }`}
            alt=""
          />
        </div>
      )}

      <ul className={`${styles.termList} ${!showMore ? styles.closed : ""}`}>
        {filteredDefinitions.map((def, idx) => (
          <li key={idx} onMouseDown={() => handleClickItem(def.text)}>
            {def.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
