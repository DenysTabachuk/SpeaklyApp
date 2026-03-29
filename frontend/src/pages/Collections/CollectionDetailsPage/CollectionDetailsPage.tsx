import { useState } from "react";
import Button from "../../../components/Button/Button";
import TermForm from "./components/TermForm/TermForm";
import TermList from "./components/TermList/TermList";
import styles from "./CollectionDetailsPage.module.css";
import moreIcon from "../../../assets/more-icon.png";
import DropDownMenu from "./components/DropDownMenu/DropDownMenu";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import { type Collection } from "../../../types/collection";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";
import { motion, AnimatePresence } from "framer-motion";
import { buildBackendAssetUrl } from "../../../config/env";

export default function CollectionDetailsPage() {
  const { id: collectionId } = useParams();

  const { data: collection, isLoading } = useQuery<Collection>({
    queryKey: ["collection-detail", Number(collectionId)],
    queryFn: async () => {
      const res = await api.get(`/collections/${collectionId}`);
      return res.data;
    },
    enabled: !!collectionId, //  запит виконується тільки якщо collectionId !== undefined
  });

  const navigate = useNavigate();

  const [addingNewTerm, setAddingNewTerm] = useState(false);
  const [showDeleteCollectionModal, setShowDeleteCollectionModal] =
    useState(false);

  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const showDeleteModal = () => setShowDeleteCollectionModal(true);
  const hideDeleteModal = () => setShowDeleteCollectionModal(false);

  const handleCollectionDelete = async () => {
    await api.delete(`collections/${collection!.id}`);
    setShowDeleteCollectionModal(false);
    navigate("/collections");
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className={styles.collectionDetailsPage}>
      {showDeleteCollectionModal && (
        <ConfirmModal
          onConfirm={handleCollectionDelete}
          onCancel={hideDeleteModal}
        >
          <h2>Попередження</h2>
          <p>
            Ви впевнені, що хочете видалити колекцію <b>{collection!.name}</b>?
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
        <h2>{collection!.name}</h2>

        {showDropDownMenu && (
          <DropDownMenu handleDelete={showDeleteModal}></DropDownMenu>
        )}

        <div className={styles.imgContainer}>
          <img src={buildBackendAssetUrl(collection!.imagePath) ?? ""} alt="" />
        </div>

        <p className={styles.description}>{collection!.description}</p>

        <TermList terms={collection!.terms || []}></TermList>

        <AnimatePresence>
          {addingNewTerm && (
            <TermForm
              key="termForm"
              stopAddingTerm={() => setAddingNewTerm(false)}
            />
          )}
        </AnimatePresence>

        {!addingNewTerm && (
          <Button type="button" glowing onClick={() => setAddingNewTerm(true)}>
            +Новий термін
          </Button>
        )}
      </div>
    </div>
  );
}
