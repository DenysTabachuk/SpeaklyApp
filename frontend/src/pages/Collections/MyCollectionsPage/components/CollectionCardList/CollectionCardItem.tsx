import type { Collection } from "../../../../../services/collectionService";
import defaultImage from "../../../../../assets/default-image.png";
import { Link } from "react-router-dom";
import Button from "../../../../../components/Button/Button";
import styles from "./CollectionCardItem.module.css";

type CollectionCardItemProps = {
  collection: Collection;
};

function CollectionCardItem({ collection }: CollectionCardItemProps) {
  return (
    <li className={styles.collectionCardItem}>
      <img
        src={
          collection.imagePath
            ? "http://localhost:3000" + collection.imagePath
            : defaultImage
        }
        alt=""
      />

      <Link to={String(collection.id)} className={styles.collectionContent}>
        <div>
          <h3>{collection.name}</h3>
          <p>{collection.description}</p>
        </div>
        <Button glowing>До колекції &gt;</Button>
      </Link>
    </li>
  );
}

export default CollectionCardItem;
