import Button from "../../../../components/Button/Button";
import TermInput from "../inputs/TermInput";
import DefinitionInputs from "../inputs/DefinitionInputs";
import { getTermDefinitions } from "../../../../services/termCollectionsService";
import { useHttp } from "../../../../hooks/useHttp";
import { addNewTerm } from "../../../../services/termCollectionsService";
import type {
  Definition,
  Term,
} from "../../../../services/termCollectionsService";
import styles from "../CollectionView.module.css";

type NewTermFormParams = {
  collectionId: string;
};

export default function NewTermForm({ collectionId }: NewTermFormParams) {
  const {
    data: createrTerm,
    isLoading: isLoadingAddNewTerm,
    error: errorAddNewTerm,
    execute: executeAddTerm,
  } = useHttp(addNewTerm);

  const {
    data: definitions,
    isLoading: isLoadingDefinitions,
    error: errorDefinitions,
    execute: fetchDefinitions,
  } = useHttp<Definition[], [string]>(getTermDefinitions);

  console.log(definitions);

  const handleSumbit = (formData: FormData) => {
    const term = formData.get("term") as string;
    const definitions = formData.getAll("definitions") as string[];

    const Term: Term = {
      word: term,
      definitions,
    };

    const token = localStorage.getItem("token");

    if (token) {
      executeAddTerm(collectionId, token, Term);
    }

    console.log(Term);
  };

  return (
    <form action={handleSumbit} className={styles.newTermForm}>
      <TermInput fetchDefinitions={fetchDefinitions}></TermInput>
      <DefinitionInputs definitions={definitions}></DefinitionInputs>

      <Button glowing>Зберегти</Button>
    </form>
  );
}
