import Button from "../../../../components/Button/Button";
import TermInput from "./inputs/TermInput";
import DefinitionInputs from "./inputs/DefinitionInputs";
import { useHttp } from "../../../../hooks/useHttp";
import {
  addNewTerm,
  editTerm,
  getTermDefinitions,
} from "../../../../services/termService";
import type { Definition, Term } from "../../../../services/termService";
import styles from "./TermForms.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type NewTermFormParams = {
  term?: Term;
  onSubmitSuccess: (term: Term) => void;
  onCancel: () => void;
};

export default function TermForm({
  term: existinngTerm,
  onSubmitSuccess,
  onCancel,
}: NewTermFormParams) {
  const { id: collectionId } = useParams<{ id: string }>();
  const [term, setTerm] = useState<Term | undefined>(existinngTerm);

  const {
    data: createdTerm,
    error: addNewTermError,
    execute: executeAddTerm,
  } = useHttp<Term, [string, string, Term]>(addNewTerm);

  const {
    data: editedTerm,
    error: editedTermError,
    execute: executeEditTerm,
  } = useHttp<Term, [Term, string]>(editTerm);

  useEffect(() => {
    if (createdTerm) {
      onSubmitSuccess(createdTerm);
    }

    if (editedTerm) {
      onSubmitSuccess(editedTerm);
    }
  }, [createdTerm, editedTerm]);

  const {
    data: definitions,
    isLoading: isLoadingDefinitions,
    error: errorDefinitions,
    execute: fetchDefinitions,
  } = useHttp<Definition[], [string]>(getTermDefinitions);

  const handleSumbit = (formData: FormData) => {
    const word = formData.get("term") as string;
    const definitions = formData.getAll("definitions") as string[];

    const newTerm: Term = {
      id: term?.id,
      collectionId: term?.collectionId,
      word,
      definitions: definitions.map((def) => ({ text: def })),
    };

    const token = localStorage.getItem("token");

    if (token) {
      if (existinngTerm) {
        executeEditTerm(newTerm, token);
      } else {
        executeAddTerm(collectionId!, token, newTerm);
      }
    }
  };

  return (
    <form action={handleSumbit} className={styles.newTermForm}>
      <div className={styles.inputsContainer}>
        <TermInput
          term={existinngTerm?.word ?? ""}
          fetchDefinitions={fetchDefinitions}
        ></TermInput>

        <DefinitionInputs
          definitions={definitions}
          userDefinitions={existinngTerm?.definitions}
        ></DefinitionInputs>
      </div>

      <div className={styles.buttonContainer}>
        <Button glowing accept>
          Зберегти
        </Button>
        <Button glowing decline onClick={onCancel}>
          Відмінити
        </Button>
      </div>
    </form>
  );
}
