import type { EditableTerm } from "./TermAndDefinitionsList";
import styles from "./Lists.module.css";
import editIcon from "../../../../assets/edit-icon.png";
import deleteIcon from "../../../../assets/delete-icon.png";
import TermForm from "../forms/TermForm";

type TermAndDefinitionsItemProps = {
  term: EditableTerm;
  index: number;
  onEdit: (index: number) => void;
  onDelete: () => void;
};

export default function TermAndDefinitionsItem({
  term,
  index,
  onEdit,
  onDelete,
}: TermAndDefinitionsItemProps) {
  return (
    <li className={styles.Term} key={`t${term.id}`}>
      <div className={styles.TermWordContainer}>
        <p>{term.word}</p>
      </div>

      <ul className={styles.TermDefinitionsContainer}>
        {term.definitions.map((definition) => (
          <li className={styles.Definition} key={`d${definition.id}`}>
            {definition.text}
          </li>
        ))}
      </ul>

      <div className={styles.buttonContainer}>
        <button onClick={() => onEdit(index)}>
          <img src={editIcon} width={32} height={32} className="icon" />
        </button>
        <button onClick={() => onDelete()}>
          <img src={deleteIcon} width={32} height={32} className="icon" />
        </button>
      </div>
    </li>
  );
}
