import type { Definition } from "../types/definition";

export async function getTermDefinitions(selectedTerm: string) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedTerm}`
  );

  const responseData = await response.json();

  const definitions: Definition[] = [];
  for (const item of responseData) {
    for (const meaning of item.meanings) {
      for (const def of meaning.definitions) {
        definitions.push({
          text: "[" + meaning.partOfSpeech + "] " + def.definition,
        });
      }
    }
  }

  return definitions;
}
