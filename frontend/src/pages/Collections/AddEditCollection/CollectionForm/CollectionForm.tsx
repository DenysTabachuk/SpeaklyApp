import Input from "../../../../components/Inputs/Input";
import Textarea from "../../../../components/Inputs/TextArea";
import deleteIcon from "../../../../assets/delete-icon.png";
import { useState } from "react";
import styles from "./CollectionForm.module.css";
import Button from "../../../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";

type CollectionFormProps = {
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    imagePath?: string | null;
  };
  // id опціональний
  onSubmit: (formData: FormData, token: string, id?: string) => Promise<any>;
  navigateTo: string;
};

export default function CollectionForm({
  onSubmit,
  initialValues,
  navigateTo,
}: CollectionFormProps) {
  const navigate = useNavigate();

  // локальний стан для всіх полів
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialValues?.imagePath
      ? "http://localhost:3000" + initialValues?.imagePath
      : null
  );
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleImageDelete = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (token) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (file) {
        formData.append("image", file);
      }

      try {
        const savedCollection = await onSubmit(
          formData,
          token,
          initialValues?.id
        );
        console.log("savedCollection: ", savedCollection);
        navigate(navigateTo, {
          state: { refresh: Date.now(), collection: savedCollection },
        });
      } catch (err) {
        setError("Помилка при збереженні колекції");
        console.error(err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <Input
        name="name"
        type="text"
        label="Назва"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        name="description"
        label="Опис"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Зображення:</label>
      {preview ? (
        <div className={styles.imgContainer}>
          <img
            src={deleteIcon}
            className={"icon " + styles.deleteIcon}
            alt="Видалити"
            onClick={handleImageDelete}
          />
          <img
            src={preview}
            alt="Прев’ю"
            style={{ maxWidth: "200px", borderRadius: "8px" }}
          />
        </div>
      ) : (
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className={styles.buttonContainer}>
        <Button glowing type="submit">
          <b>Зберегти</b>
        </Button>

        <Link to={navigateTo}>
          <Button glowing decline>
            <b>Відмінити</b>
          </Button>
        </Link>
      </div>
    </form>
  );
}
