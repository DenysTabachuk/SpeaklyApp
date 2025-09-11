import type { Term } from "../../../../services/termService";
import styles from "./TermList.module.css";
import TermItem from "./TermItem";
import ConfirmModal from "../../../../components/Modal/ConfirmModal";
import { deleteTerm } from "../../../../services/termService";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHttp } from "../../../../hooks/useHttp";
import TermForm from "../TermForm/TermForm";

type TermListProps = {
  terms: Term[];
};

export type EditableTerm = Term & { isEditing: boolean };

// Обробку помилок додати
export default function TermList({ terms }: TermListProps) {
  const { id: collectionId } = useParams<{ id: string }>();

  const [editableTerms, setEditableTerms] = useState<EditableTerm[]>(
    terms.map((t) => ({ ...t, isEditing: false }))
  );

  const [showConfirmModal, setShowConfrimModal] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  useEffect(() => {
    setEditableTerms(terms.map((t) => ({ ...t, isEditing: false })));
  }, [terms]);

  const {
    data,
    isLoading,
    error,
    execute: executeDeleteTerm,
  } = useHttp(deleteTerm);

  const handleTermEdit = (index: number) => {
    const term = editableTerms[index];
    const termsCopy = [...editableTerms];

    term.isEditing = !term.isEditing;
    termsCopy[index] = term;
    setEditableTerms(termsCopy);
  };

  const handleTermDelete = () => {
    if (deletingIndex === null) return;

    const newEditableTerms = editableTerms.filter(
      (_, i) => i !== deletingIndex
    );
    setEditableTerms(newEditableTerms);
    setShowConfrimModal(false);
    setDeletingIndex(null);

    // звернення на бек
    const token = localStorage.getItem("token");
    if (token) {
      executeDeleteTerm(collectionId!, editableTerms[deletingIndex].id!, token);
    }
  };

  const showModal = (index: number) => {
    setDeletingIndex(index);
    setShowConfrimModal(true);
  };

  const hideModal = () => {
    setShowConfrimModal(false);
  };

  const onSubmitSuccess = (editedTerm: Term, index: number) => {
    const termsCopy = [...editableTerms];
    const term = { ...editedTerm, isEditing: false };

    termsCopy[index] = term;
    setEditableTerms(termsCopy);
  };

  return (
    <ul className={styles.TermAndDefinitionsList}>
      {showConfirmModal && (
        <ConfirmModal onConfirm={handleTermDelete} onCancel={hideModal}>
          <h2>Попередження</h2>
          <p>
            Ви впевнені, що хочете видалити термін
            <b> {terms[deletingIndex!].word}</b>? Видалений термін та його
            визначення доведеться повертати вручну!
          </p>
        </ConfirmModal>
      )}

      {editableTerms.map((term, index) =>
        term.isEditing ? (
          <TermForm
            term={term}
            onSubmitSuccess={(editedTerm) => onSubmitSuccess(editedTerm, index)}
            onCancel={() => {}}
          />
        ) : (
          <TermItem
            term={term}
            index={index}
            onEdit={handleTermEdit}
            onDelete={() => showModal(index)}
          ></TermItem>
        )
      )}
    </ul>
  );
}
