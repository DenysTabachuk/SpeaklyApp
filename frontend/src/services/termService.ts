export type Definition = {
  id?: number;
  termId?: number;
  text: string;
};

export type Term = {
  id?: number;
  collectionId?: number;
  word: string;
  definitions: Definition[];
};

export type Suggestion = {
  word: string;
  score: number;
};

export const getTermSuggestion = async (term: string) => {
  const res = await fetch(`https://api.datamuse.com/sug?s=${term}`);
  if (!res.ok) throw new Error("Failed to fetch suggestions");
  const data: Suggestion[] = await res.json();
  return data;
};

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

export async function addNewTerm(
  collectionId: string,
  token: string,
  term: Term
) {
  return fetch(`http://localhost:3000/collections/${collectionId}/terms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(term),
  });
}

export async function deleteTerm(
  collectionId: string,
  termId: number,
  token: string
) {
  return fetch(
    `http://localhost:3000/collections/${collectionId}/terms/${termId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function editTerm(term: Term, token: string) {
  return fetch(
    `http://localhost:3000/collections/${term.collectionId}/terms/${term.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(term),
    }
  );
}
