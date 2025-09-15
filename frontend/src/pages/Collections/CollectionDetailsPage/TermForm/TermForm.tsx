import Button from "../../../../components/Button/Button";
import TermInput from "./inputs/TermInput";
import DefinitionInputs from "./inputs/DefinitionInputs";
import { getTermDefinitions } from "../../../../services/termService";
import type { Definition } from "../../../../types/definition";
import type { Term } from "../../../../types/term";
import styles from "./TermForms.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAddTermMutation from "../mutations/useAddTermMutation";
import useEditTermMutation from "../mutations/useEditTermMutation";

type NewTermFormParams = {
  term?: Term;
  stopAddingTerm: () => void;
};

export default function TermForm({
  term: existinngTerm,
  stopAddingTerm,
}: NewTermFormParams) {
  const [term, setTerm] = useState<Term | undefined>(existinngTerm);
  const [definitions, setDefinitions] = useState<Definition[]>();
  const { id: collectionId } = useParams();

  const addTermMutation = useAddTermMutation();
  const editTermMutation = useEditTermMutation();

  // треба щоб при редагуванні
  useEffect(() => {
    if (term) {
      fetchDefinitions(term.word);
    }
  }, []);

  const fetchDefinitions = async (selectedTerm: string) => {
    const definition = await getTermDefinitions(selectedTerm);
    setDefinitions(definition);
  };

  const handleSubmit = async (formData: FormData) => {
    const word = formData.get("term") as string;
    const definitions = formData.getAll("definitions") as string[];

    const newTerm: Term = {
      id: term?.id,
      collectionId: Number(collectionId),
      word,
      definitions: definitions.map((def) => ({ text: def })),
    };

    if (existinngTerm) {
      editTermMutation.mutate(newTerm);
    } else {
      addTermMutation.mutate(newTerm);
    }

    stopAddingTerm();
  };

  return (
    <form action={handleSubmit} className={styles.newTermForm}>
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
        <Button glowing decline onClick={stopAddingTerm}>
          Відмінити
        </Button>
      </div>
    </form>
  );
}
