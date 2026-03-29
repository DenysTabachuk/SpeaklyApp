import type { Collection } from "../../../../../types/collection";
import defaultImage from "../../../../../assets/default-image.png";
import { Link } from "react-router-dom";
import Button from "../../../../../components/Button/Button";
import styles from "./CollectionCardItem.module.css";
import { buildBackendAssetUrl } from "../../../../../config/env";

type CollectionCardItemProps = {
  collection: Collection;
};

function CollectionCardItem({ collection }: CollectionCardItemProps) {
  return (
    <li className={styles.collectionCardItem}>
      <div className={styles.imgContainer}>
        <img
          src={
            collection.imagePath
              ? buildBackendAssetUrl(collection.imagePath)
              : defaultImage
          }
          alt=""
        />
      </div>

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
