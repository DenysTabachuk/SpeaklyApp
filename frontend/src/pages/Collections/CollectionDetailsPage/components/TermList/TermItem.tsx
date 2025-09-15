import type { EditableTerm } from "./TermList";
import styles from "./TermList.module.css";
import editIcon from "../../../../../assets/edit-icon.png";
import deleteIcon from "../../../../../assets/delete-icon.png";
import { motion } from "framer-motion";

type TermAndDefinitionsItemProps = {
  term: EditableTerm;
  index: number;
  onEdit: (index: number) => void;
  onDelete: () => void;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TermItem({
  term,
  index,
  onEdit,
  onDelete,
}: TermAndDefinitionsItemProps) {
  return (
    <motion.li
      className={styles.Term}
      variants={itemVariants}
      animate={{
        opacity: 1,
        y: 0,
        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"], // рух градієнта
        transition: {
          backgroundPosition: {
            duration: 10,
            repeat: Infinity,
            repeatType: "loop",
            delay: index * 1.5,
          },
        },
      }}
      exit={{
        height: 0,
        opacity: 0,
        transition: {
          opacity: { duration: 0.5, ease: "easeIn" },
          height: { duration: 0.3, ease: "easeIn" },
        },
      }}
    >
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
    </motion.li>
  );
}
