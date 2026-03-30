import Input from "../../../../components/Inputs/Input";
import Textarea from "../../../../components/Inputs/TextArea";
import deleteIcon from "../../../../assets/delete-icon.png";
import { useState } from "react";
import styles from "./CollectionForm.module.css";
import Button from "../../../../components/Button/Button";
import { Link, Form } from "react-router-dom";
import { buildBackendAssetUrl } from "../../../../config/env";

type CollectionFormProps = {
  initialValues?: {
    id?: number;
    name: string;
    description: string;
    imagePath?: string | null;
  };
  navigateTo: string;
};

export default function CollectionForm({
  initialValues,
  navigateTo,
}: CollectionFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [preview, setPreview] = useState<string | null>(
    initialValues?.imagePath
      ? buildBackendAssetUrl(initialValues.imagePath)
      : null
  );
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleImageDelete = () => {
    setPreview(null);
  };

  return (
    <Form method="post" encType="multipart/form-data">
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
      {preview && (
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
      )}

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        style={{
          display: preview ? "none" : "block",
        }}
      />

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
    </Form>
  );
}
