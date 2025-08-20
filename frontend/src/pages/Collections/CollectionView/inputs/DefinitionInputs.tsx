import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Inputs/Input";
import PartOfSpeechBadge from "./PartOfSpeechBadge";
import TermDefinitionList from "../lists/TermDefinitionsList";
import type { Definition } from "../../../../services/termCollectionsService";
import style from "../CollectionView.module.css";
import { useState } from "react";

type DefinitionInputsPropts = {
  definitions: Definition[] | null;
};

export default function DefinitionInputs({
  definitions,
}: DefinitionInputsPropts) {
  const [myDefinitions, setMyDefinitions] = useState([
    { text: "", partOfSpeech: "", inFocus: false },
  ]);

  const addNewDefinition = () => {
    setMyDefinitions([
      ...myDefinitions,
      { text: "", partOfSpeech: "", inFocus: false },
    ]);
  };

  const handleDefinitionInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const defiinitionWeChanging = myDefinitions[index];
    const updatedDefinitions = [...myDefinitions];

    updatedDefinitions[index] = {
      text: event.target.value,
      partOfSpeech: defiinitionWeChanging.partOfSpeech,
      inFocus: true,
    };
    setMyDefinitions(updatedDefinitions);
  };

  const handleDefinitionSelect = (
    index: number,
    defitinitonText: string,
    partOfSpeech: string
  ) => {
    console.log(index, defitinitonText);

    const newMyDefinitions = [...myDefinitions];
    newMyDefinitions[index] = {
      // text: `[${partOfSpeech}] defitinitonText`,
      text: defitinitonText,
      partOfSpeech: partOfSpeech,
      inFocus: false,
    };
    setMyDefinitions(newMyDefinitions);
  };

  const handleRemoveDefinition = (index: number) => {
    const updatedDefinitions = myDefinitions.filter((_, i) => i !== index);
    setMyDefinitions(updatedDefinitions);
  };

  const setInputFocus = (index: number, focus: boolean) => {
    const newMyDefinitions = [...myDefinitions];
    newMyDefinitions[index] = {
      ...newMyDefinitions[index],
      inFocus: focus,
    };
    setMyDefinitions(newMyDefinitions);
  };

  return (
    <div className={style.defenitionInputs}>
      {myDefinitions.map((definition, index) => (
        <>
          <div key={index} className={style.definitionInputButton}>
            <Input
              label={`Визначення ${index + 1}`}
              onChange={(e) => handleDefinitionInputChange(index, e)}
              onFocus={() => setInputFocus(index, true)}
              onBlur={() => setInputFocus(index, false)}
              value={definition.text}
              name="definitions"
            />
            {definition.partOfSpeech !== "" && (
              <PartOfSpeechBadge partOfSpeech={definition.partOfSpeech} />
            )}

            <Button type="button" onClick={() => handleRemoveDefinition(index)}>
              -
            </Button>
          </div>

          {definitions && definition.inFocus && (
            <TermDefinitionList
              definitionIndex={index}
              definitionText={definition.text}
              definitionsList={definitions}
              definitionOnClick={handleDefinitionSelect}
            />
          )}
        </>
      ))}

      <Button type="button" glowing onClick={addNewDefinition}>
        + Визначення
      </Button>
    </div>
  );
}
