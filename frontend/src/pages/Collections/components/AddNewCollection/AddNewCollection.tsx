import Input from "../../../../components/Inputs/Input";
import Textarea from "../../../../components/Inputs/TextArea";
import Button from "../../../../components/Button/Button";
import styles from "./AddNewCollection.module.css";
import { addNewCollection } from "../../../../services/collectionsService";
import type { Collection } from "../../../../services/collectionsService";
import { useState } from "react";

type AddNewCollectionProps = {
  stopAdding: () => void;
  addCollection: (collection: Collection) => void;
};

export default function AddNewCollection({
  stopAdding,
  addCollection,
}: AddNewCollectionProps) {
  const [error, setError] = useState<string | null>(null);

  const saveColletionAction = async (formData: FormData) => {
    const collection = {
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
    };

    const token = localStorage.getItem("token");
    console.log("-");
    if (token) {
      const response = await addNewCollection(collection, token);
      if (response.error) {
        setError(response.error);
      }
      console.log(response);
      if (response.collection) {
        setError("");
        console.log("+");
        addCollection(response.collection);
      }
    }
  };

  return (
    <form action={saveColletionAction}>
      <h2>Сторюємо нову колекцію</h2>
      <Input name="name" type="text" label="Назва" />
      <Textarea name="description" id="description" label="Опис"></Textarea>

      {error && <p>{error}</p>}

      <div className={styles.buttonContainer}>
        <Button accept glowing>
          <b>Зберегти</b>
        </Button>

        <Button decline glowing onClick={stopAdding}>
          <b>Відмінити</b>
        </Button>
      </div>
    </form>
  );
}
