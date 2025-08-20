import Input from "../../../components/Inputs/Input";
import Textarea from "../../../components/Inputs/TextArea";
import Button from "../../../components/Button/Button";
import styles from "./AddNewCollection.module.css";
import { addNewCollection } from "../../../services/termCollectionsService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AddNewCollectionPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const saveColletionAction = async (formData: FormData) => {
    const collection = {
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
    };

    const token = localStorage.getItem("token");
    if (token) {
      const response = await addNewCollection(collection, token);
      if (response.error) {
        setError(response.error);
      } else {
        navigate(-1);
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
        <Button glowing>
          <b>Зберегти</b>
        </Button>

        <Link to="/collections">
          <Button glowing>
            <b>Відмінити</b>
          </Button>
        </Link>
      </div>
    </form>
  );
}
