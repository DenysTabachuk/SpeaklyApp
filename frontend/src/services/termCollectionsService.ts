export type newCollection = {
  name: string;
  description: string;
};

export type Collection = {
  id: number;
  name: string;
  description: string;
};

export type GetUserCollectionsResponse = {
  collections: Collection[];
  error: string;
};

export type AddNewCollectionResponse = {
  collection?: Collection;
  error?: string;
};

export type Suggestion = {
  word: string;
  score: number;
};

export type Definition = {
  partOfSpeech: string;
  text: string;
};

export type Term = {
  word: string;
  definitions: string[];
};

export async function getUserCollections(token: string) {
  const response = await fetch("http://localhost:3000/collections", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function getCollectionById(collectionID: string, token: string) {
  return fetch(`http://localhost:3000/collections/${collectionID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function addNewCollection(
  newCollection: newCollection,
  token: string
): Promise<AddNewCollectionResponse> {
  const response = await fetch("http://localhost:3000/collections", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCollection),
  });

  const data = await response.json();
  return data as AddNewCollectionResponse;
}

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
          partOfSpeech: meaning.partOfSpeech,
          text: def.definition,
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
