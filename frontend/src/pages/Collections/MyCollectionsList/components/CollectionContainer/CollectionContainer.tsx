import type { Collection } from "../../../../../services/collectionService";
import styles from "../../MyCollections.module.css";
import { Link } from "react-router-dom";
import defaultImage from "../../../../../assets/default-image.png";
import Button from "../../../../../components/Button/Button";

type CollectionConatinerProps = {
  collections: Collection[];
};

export default function CollectionConatiner({
  collections,
}: CollectionConatinerProps) {
  return (
    <>
      <ul className={styles.collectionContainer}>
        {collections.map((collection) => (
          <li key={collection.id} className={styles.collectionItem}>
            <img
              src={
                collection.imagePath
                  ? "http://localhost:3000" + collection.imagePath
                  : defaultImage
              }
              alt=""
            />

            <Link
              to={String(collection.id)}
              className={styles.collectionDetails}
            >
              <div>
                <h3>{collection.name}</h3>
                <p> {collection.description}</p>
              </div>
              <Button glowing>До колекції &gt;</Button>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
