import { useHttp } from "../../../hooks/useHttp";
import { getCollectionById } from "../../../services/collectionService";
import type { Collection } from "../../../services/collectionService";
import CollectionForm from "./CollectionForm/CollectionForm";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { editCollection } from "../../../services/collectionService";

export default function EditCollection() {
  const { id: collectionId } = useParams<{ id: string }>();

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

  async function handleEditCollection(
    formData: FormData,
    token: string,
    id?: string
  ) {
    console.log("handleEditCollection");
    if (!id) {
      throw new Error("Collection ID is required");
    }
    try {
      const response = await editCollection(formData, token, id); // можлмво тут теж варто хук юзати
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoadingCollection) return <p>Завантаження колекції...</p>;
  if (errorCollection) return <p>Помилка: {errorCollection}</p>;
  if (!collection) return <p>Колекція не знайдена</p>;

  return (
    <>
      <h2>Редагуємо колекцію</h2>
      <CollectionForm
        initialValues={{
          id: collectionId,
          name: collection.name,
          description: collection.description ?? "",
          imagePath: collection.imagePath ?? null,
        }}
        navigateTo={`/collections/${collectionId}`}
        onSubmit={handleEditCollection}
      />
    </>
  );
}
