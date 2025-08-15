import type { Collection } from "../../../../services/collectionsService";
import styles from "./CollectionCointainer.module.css";

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
            <h3>{collection.name}</h3>
            <p> {collection.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
