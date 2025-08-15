import type { Collection } from "../../../../../services/collectionsService";
import styles from "./CollectionCointainer.module.css";
import { Link } from "react-router-dom";

type CollectionConatinerProps = {
  collections: Collection[];
};

export default function CollectionConatiner({
  collections,
}: CollectionConatinerProps) {
  console.log(collections);

  return (
    <>
      <h2>Мої колекції</h2>
      <ul className={styles.collectionContainer}>
        {collections.map((collection) => (
          <li key={collection.id} className={styles.collectionItem}>
            <Link to={String(collection.id)}>
              <h3>{collection.name}</h3>
            </Link>
            <p> {collection.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
