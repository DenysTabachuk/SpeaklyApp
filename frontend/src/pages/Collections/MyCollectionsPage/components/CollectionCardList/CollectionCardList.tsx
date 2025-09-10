import styles from "./CollectionCardList.module.css";
import CollectionCardItem from "./CollectionCardItem";

type CollectionCardListProps = {
  children: React.ReactNode;
};

function CollectionCardList({ children }: CollectionCardListProps) {
  return <ul className={styles.collectionCardList}>{children}</ul>;
}

// робимо Compound Component
CollectionCardList.Item = CollectionCardItem;

export default CollectionCardList;
