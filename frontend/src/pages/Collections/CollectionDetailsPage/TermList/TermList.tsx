import type { Term } from "../../../../types/term";
import styles from "./TermList.module.css";
import TermItem from "./TermItem";
import ConfirmModal from "../../../../components/Modal/ConfirmModal";
import { useState, useEffect } from "react";
import TermForm from "../TermForm/TermForm";

import useDeleteTermMutation from "../mutations/useDeleteTermMutation";
import useEditTermMutation from "../mutations/useEditTermMutation";

type TermListProps = {
  terms: Term[];
};

export type EditableTerm = Term & { isEditing: boolean };

export default function TermList({ terms }: TermListProps) {
  const deleteMutation = useDeleteTermMutation();
  const editMutation = useEditTermMutation();

  const [editableTerms, setEditableTerms] = useState<EditableTerm[]>(
    terms.map((t) => ({ ...t, isEditing: false }))
  );

  useEffect(() => {
    setEditableTerms(terms.map((t) => ({ ...t, isEditing: false })));
  }, [terms]);

  const [showConfirmModal, setShowConfrimModal] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const toggleTermEditing = (index: number) => {
    const term = editableTerms[index];
    const termsCopy = [...editableTerms];

    term.isEditing = !term.isEditing;
    termsCopy[index] = term;
    setEditableTerms(termsCopy);
  };

  const onSubmitEditSuccess = (editedTerm: Term) => {
    const term = { ...editedTerm, isEditing: false };
    editMutation.mutate(term);
  };

  const handleTermDelete = () => {
    if (deletingIndex === null) return;
    const termToDelete = editableTerms[deletingIndex];

    deleteMutation.mutate(termToDelete);
    setShowConfrimModal(false);
    setDeletingIndex(null);
  };

  const showModal = (index: number) => {
    setDeletingIndex(index);
    setShowConfrimModal(true);
  };

  const hideModal = () => {
    setShowConfrimModal(false);
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
            onSubmitSuccess={(editedTerm) => onSubmitEditSuccess(editedTerm)}
            onCancel={() => {}}
          />
        ) : (
          <TermItem
            term={term}
            index={index}
            onEdit={toggleTermEditing}
            onDelete={() => showModal(index)}
          ></TermItem>
        )
      )}
    </ul>
  );
}
