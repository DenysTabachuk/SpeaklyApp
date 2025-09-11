import styles from "./DropDownMenu.module.css";
import editIcon from "../../../../assets/edit-icon.png";
import deleteIcon from "../../../../assets/delete-icon.png";
import { Link } from "react-router-dom";

type DropDownMenu = {
  handleDelete: () => void;
};

export default function DropDownMenu({ handleDelete }: DropDownMenu) {
  return (
    <ul className={styles.dropDownMenu}>
      <Link to="edit">
        <li>
          <img src={editIcon} className={styles.icon} />
          Редагувати
        </li>
      </Link>

      <li>
        <img src={deleteIcon} className={styles.icon} onClick={handleDelete} />
        Видалити
      </li>
    </ul>
  );
}
