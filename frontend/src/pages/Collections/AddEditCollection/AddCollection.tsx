import { addNewCollection } from "../../../services/collectionService";
import CollectionForm from "./CollectionForm/CollectionForm";

export default function AddNewCollectionPage() {
  return (
    <>
      <h2>Створюємо нову колекцію</h2>
      <CollectionForm
        onSubmit={addNewCollection}
        navigateTo={"/collections"}
      ></CollectionForm>
    </>
  );
}
