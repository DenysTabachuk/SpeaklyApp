import { useState } from "react";
import Button from "../../../components/Button/Button";
import TermForm from "./TermForm/TermForm";
import TermList from "./TermList/TermList";
import styles from "./CollectionView.module.css";
import moreIcon from "../../../assets/more-icon.png";
import DropDownMenu from "./DropDownMenu/DropDownMenu";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import type { Term } from "../../../services/termService";
import {
  deleteCollection,
  type Collection,
} from "../../../services/collectionService";
import { useNavigate, useLoaderData } from "react-router-dom";

export default function CollectionView() {
  // 1️ Отримуємо дані з loader
  const initialCollection: Collection = useLoaderData();

  // 2️ Зберігаємо у локальному state
  const [collection, setCollection] = useState<Collection>(initialCollection);

  const navigate = useNavigate();

  const [addingNewTerm, setAddingNewTerm] = useState(false);
  const [showDeleteCollectionModal, setShowDeleteCollectionModal] =
    useState(false);

  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const showDeleteModal = () => setShowDeleteCollectionModal(true);
  const hideDeleteModal = () => setShowDeleteCollectionModal(false);

  const afterTermAdded = (term: Term) => {
    setCollection((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        terms: [...(prev.terms ?? []), { ...term }], // копія терміну
      };
    });
    setAddingNewTerm(false);
  };

  const handleCollectionDelete = async () => {
    const token = localStorage.getItem("token");
    if (!collection.id || !token) return;

    try {
      await deleteCollection(collection.id, token);
      navigate("/collections");
    } catch (err) {
      console.error(err);
    }
    setShowDeleteCollectionModal(false);
  };

  return (
    <div className={styles.CollectionView}>
      {showDeleteCollectionModal && (
        <ConfirmModal
          onConfirm={handleCollectionDelete}
          onCancel={hideDeleteModal}
        >
          <h2>Попередження</h2>
          <p>
            Ви впевнені, що хочете видалити колекцію <b>{collection.name}</b>?
            Цю дію не можна буде скасувати!
          </p>
        </ConfirmModal>
      )}

      <div>
        <img
          src={moreIcon}
          className={"icon " + styles.moreIcon}
          alt=""
          onClick={() => setShowDropDownMenu(!showDropDownMenu)}
        />
        <h2>{collection.name}</h2>

        {showDropDownMenu && (
          <DropDownMenu handleDelete={showDeleteModal}></DropDownMenu>
        )}

        <div className={styles.collectionContainer}>
          <img
            className={styles.collectionImg}
            src={"http://localhost:3000" + collection.imagePath}
            alt=""
          />
        </div>

        <p>{collection.description}</p>

        <TermList terms={collection.terms || []}></TermList>
      </div>

      {addingNewTerm ? (
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
