import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useHttp } from "../../../hooks/useHttp";
import Button from "../../../components/Button/Button";
import TermForm from "./TermForm/TermForm";
import TermList from "./TermList/TermList";
import type { Collection } from "../../../services/collectionService";
import { getCollectionById } from "../../../services/collectionService";
import styles from "./CollectionView.module.css";
import moreIcon from "../../../assets/more-icon.png";
import DropDownMenu from "./DropDownMenu/DropDownMenu";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import type { Term } from "../../../services/termService";
import { deleteCollection } from "../../../services/collectionService";
import { useNavigate } from "react-router-dom";

export default function CollectionView() {
  const { id: collectionId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [addingNewTerm, setAddingNewTerm] = useState(false);
  const [showDeleteCollectionModal, setShowDeleteCollectionModal] =
    useState(false);

  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const showDeleteModal = () => setShowDeleteCollectionModal(true);
  const hideDeleteModal = () => setShowDeleteCollectionModal(false);

  const {
    data: collection,
    setData: setCollection,
    isLoading: isLoadingCollection,
    error: errorCollection,
    execute: fetchCollection,
  } = useHttp<Collection, [string, string]>(getCollectionById);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (location.state) {
      setCollection(location.state.collection);
      return;
    }

    if (collectionId && token) {
      fetchCollection(collectionId, token);
    }
  }, [collectionId, location.state]);

  const afterTermAdded = (term: Term) => {
    setCollection((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        terms: [...(prev.terms ?? []), { ...term }], // копія терміну
      };
    });
    console.log("+++ оновився collection");
    setAddingNewTerm(false);
  };

  const handleCollectionDelete = async () => {
    const token = localStorage.getItem("token");
    if (!collectionId || !token) return;

    try {
      await deleteCollection(collectionId, token);
      navigate("/collections");
    } catch (err) {
      console.error(err);
    }
    setShowDeleteCollectionModal(false);
  };

  if (isLoadingCollection) return <p>Завантаження колекції...</p>;
  if (errorCollection) return <p>Помилка: {errorCollection}</p>;
  if (!collection) return <p>Колекція не знайдена</p>;

  return (
    <div className={styles.CollectionView}>
      <div>
        <h2>{collection.name}</h2>
        <img
          src={moreIcon}
          className={"icon " + styles.moreIcon}
          alt=""
          onClick={() => setShowDropDownMenu(!showDropDownMenu)}
        />

        {showDropDownMenu && (
          <DropDownMenu handleDelete={showDeleteModal}></DropDownMenu>
        )}

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
