import { useEffect, useState } from "react";
import type { Collection } from "../../../services/collectionsService";
import { getCollectionById } from "../../../services/collectionsService";
import { useParams } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Inputs/Input";
import TermSuggestionList from "./TermSuggestionsList";
import TermDefinitionList from "./TermDefinitionsList";
import styles from "./CollectionView.module.css";

export type Suggestion = {
  word: string;
  score: number;
};

export type Definition = {
  partOfSpeech: string;
  definition: string;
};

export default function CollectionView() {
  const { id: collectionId } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [addingNewTerm, setAddingNewTerm] = useState(false);
  const [newTerm, setNewTerm] = useState("");
  const [termSuggestions, setTermSuggestions] = useState<Suggestion[]>([]);

  const [definitions, setDefinitions] = useState<Definition[]>([]);

  useEffect(() => {
    async function fetchCollection() {
      try {
        const token = localStorage.getItem("token");
        if (collectionId && token) {
          const response = await getCollectionById(collectionId, token);
          const responseData = await response.json();
          setCollection(responseData.collection);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollection();
  }, [collectionId]);

  const handleAddNewTerm = () => {
    setAddingNewTerm(true);
  };

  const getTermSuggestion = async () => {
    const response = await fetch(`https://api.datamuse.com/sug?s=${newTerm}`);
    const responseData = await response.json();
    setTermSuggestions(responseData);
  };

  const getTermDefinitions = async (selectedTerm: string) => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedTerm}`
    );
    const responseData = await response.json();
    // console.log(responseData);
    const definitions: Definition[] = [];
    for (const item of responseData) {
      for (const meaning of item.meanings) {
        for (const def of meaning.definitions) {
          definitions.push({
            partOfSpeech: meaning.partOfSpeech,
            definition: def.definition,
          });
        }
      }
    }
    setDefinitions(definitions);
    console.log(definitions);
  };

  const handleTermInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTerm = event.target.value;
    setNewTerm(newTerm);
    getTermSuggestion();
  };

  const handleSuggestionSelect = (selectedTerm: string) => {
    setNewTerm(selectedTerm);
    setTermSuggestions([]);
    getTermDefinitions(selectedTerm);
  };

  if (isLoading) return <p>Завантаження...</p>;
  if (!collection) return <p>Колекцію не знайдено</p>;

  if (collection) {
    return (
      <div className={styles.CollectionViewPage}>
        <h2>{collection.name}</h2>
        <p>{collection.description}</p>
        {addingNewTerm ? (
          <>
            <Input
              label="Термін"
              onChange={handleTermInputChange}
              value={newTerm}
            />
            <TermSuggestionList
              termSuggestionList={termSuggestions}
              termSuggestionOnClick={handleSuggestionSelect}
            />

            <Input label="Визначення"></Input>

            <TermDefinitionList
              definitions={definitions}
              definitionOnClick={() => {}}
            ></TermDefinitionList>
          </>
        ) : (
          <Button glowing onClick={handleAddNewTerm}>
            +Новий термін
          </Button>
        )}
      </div>
    );
  }
}
