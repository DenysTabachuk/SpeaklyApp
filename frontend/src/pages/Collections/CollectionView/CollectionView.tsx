import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttp } from "../../../hooks/useHttp";
import Button from "../../../components/Button/Button";
import TermForm from "./forms/TermForm";
import TermAndDefinitionsList from "./lists/TermAndDefinitionsList";
import type { Collection } from "../../../services/collectionService";
import { getCollectionById } from "../../../services/collectionService";
import styles from "./CollectionView.module.css";

export default function CollectionView() {
  const { id: collectionId } = useParams<{ id: string }>();
  const [addingNewTerm, setAddingNewTerm] = useState(false);

  const {
    data: collection,
    isLoading: isLoadingCollection,
    error: errorCollection,
    execute: fetchCollection,
  } = useHttp<Collection, [string, string]>(getCollectionById);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (collectionId && token) {
      fetchCollection(collectionId, token);
    }
  }, []);

  const afterTermAdded = () => {
    // потім, коли буде працювати, оптимізувати до локального оновлення
    const token = localStorage.getItem("token");
    if (collectionId && token) {
      fetchCollection(collectionId, token);
    }
    setAddingNewTerm(false);
  };

  if (isLoadingCollection) return <p>Завантаження колекції...</p>;
  if (errorCollection) return <p>Помилка: {errorCollection}</p>;
  if (!collection) return <p>Колекція не знайдена</p>;

  return (
    <div className={styles.CollectionViewPage}>
      <h2>{collection.name}</h2>
      <p>{collection.description}</p>

      <TermAndDefinitionsList
        terms={collection.terms || []}
      ></TermAndDefinitionsList>

      {addingNewTerm && collectionId ? (
        <TermForm
          onSubmitSuccess={afterTermAdded}
          onCancel={() => setAddingNewTerm(false)}
        />
      ) : (
        <Button type="button" glowing onClick={() => setAddingNewTerm(true)}>
          +Новий термін
        </Button>
      )}
    </div>
  );
}
