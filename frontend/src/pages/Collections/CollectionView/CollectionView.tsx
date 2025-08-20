import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttp } from "../../../hooks/useHttp";
import Button from "../../../components/Button/Button";
import NewTermForm from "./forms/NewTermForm";
import type { Collection } from "../../../services/termCollectionsService";
import { getCollectionById } from "../../../services/termCollectionsService";

export default function CollectionView() {
  const { id: collectionId } = useParams<{ id: string }>();
  const [addingNewTerm, setAddingNewTerm] = useState(false);

  const {
    data: collection,
    isLoading: isLoadingCollection,
    error: errorCollection,
    execute: fetchCollection,
  } = useHttp<Collection, [string, string]>(getCollectionById);

  // Завантажуємо колекцію
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && collectionId) {
      fetchCollection(collectionId, token);
    }
  }, []);

  const handleAddNewTerm = () => {
    setAddingNewTerm(true);
  };

  if (isLoadingCollection) return <p>Завантаження колекції...</p>;
  if (errorCollection) return <p>Помилка: {errorCollection}</p>;
  if (!collection) return <p>Колекція не знайдена</p>;

  return (
    <div>
      <h2>{collection.name}</h2>
      <p>{collection.description}</p>

      {addingNewTerm && collectionId ? (
        <NewTermForm collectionId={collectionId} />
      ) : (
        <Button glowing onClick={handleAddNewTerm}>
          +Новий термін
        </Button>
      )}
    </div>
  );
}
