import type { Definition } from "../../../../../services/collectionService";
import styles from "../Inputs.module.css";

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
  // Фільтруємо по підрядку (case-insensitive)
  const filteredDefinitions = definitionsList.filter((def) =>
    def.text.toLowerCase().includes(definitionText.toLowerCase())
  );

  return (
    <ul className={styles.termList}>
      {filteredDefinitions.map((def, idx) => (
        <li
          key={idx}
          onMouseDown={() => definitionOnClick(definitionIndex, def.text)}
        >
          {/* mousedown → коли користувач натиснув кнопку миші (ще до відпускання)
              mouseup → коли відпустив кнопку миші
              click → відпрацьовує тільки після mousedown + mouseup */}
          {def.text}
        </li>
      ))}
    </ul>
  );
}
