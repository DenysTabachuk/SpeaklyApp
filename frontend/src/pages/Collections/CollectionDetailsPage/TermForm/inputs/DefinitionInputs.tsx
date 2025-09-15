import Button from "../../../../../components/Button/Button";
import Input from "../../../../../components/Inputs/Input";
import DefinitionList from "./lists/DefinitionList";
import type { Definition } from "../../../../../types/definition";
import style from "./Inputs.module.css";
import deleteIcon from "../../../../../assets/delete-icon.png";
import { useState } from "react";

type DefinitionInputsPropts = {
  definitions: Definition[] | undefined;
  userDefinitions?: Definition[];
};

export default function DefinitionInputs({
  definitions,
  userDefinitions = [],
}: DefinitionInputsPropts) {
  const [myDefinitions, setMyDefinitions] = useState(
    userDefinitions.length > 0
      ? userDefinitions.map((def) => ({
          text: def.text,
          inFocus: false,
        }))
      : [{ text: "", inFocus: false }]
  );

  const addNewDefinition = () => {
    setMyDefinitions([...myDefinitions, { text: "", inFocus: false }]);
  };

  const handleDefinitionInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const defiinitionWeChanging = myDefinitions[index];
    const updatedDefinitions = [...myDefinitions];

    updatedDefinitions[index] = {
      text: event.target.value,
      inFocus: true,
    };
    setMyDefinitions(updatedDefinitions);
  };

  const handleDefinitionSelect = (index: number, defitinitonText: string) => {
    const newMyDefinitions = [...myDefinitions];
    newMyDefinitions[index] = {
      text: defitinitonText,
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
              autoComplete="off"
            />

            <button
              type="button"
              className={style.deleteDefinitionButton}
              onClick={() => handleRemoveDefinition(index)}
            >
              <img className="icon" src={deleteIcon} width={32} height={32} />
            </button>
          </div>

          {definitions && definition.inFocus && (
            <DefinitionList
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
