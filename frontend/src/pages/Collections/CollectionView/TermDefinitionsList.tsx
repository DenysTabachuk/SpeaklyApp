import type { Definition } from "./CollectionView";
import styles from "./CollectionView.module.css";

type DefinitionListProps = {
  definitions: Definition[];
  definitionOnClick: (selectedDefinition: string) => void;
};

export default function TermDefinitionList({
  definitions,
  definitionOnClick,
}: DefinitionListProps) {
  return (
    <ul className={styles.termList}>
      {definitions.map((def, idx) => (
        <li key={idx} onClick={() => definitionOnClick(def.definition)}>
          {def.definition}
        </li>
      ))}
    </ul>
  );
}
