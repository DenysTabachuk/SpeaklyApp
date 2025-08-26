import type { Term } from "./termService";

export type Collection = {
  id?: number;
  name: string;
  description: string | null; // бо в схемі Prisma description може бути null
  terms?: Term[];
};

export type GetUserCollectionsResponse = {
  collections: Collection[];
  error: string;
};

export type AddNewCollectionResponse = {
  collection?: Collection;
  error?: string;
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
  сollection: Collection,
  token: string
): Promise<AddNewCollectionResponse> {
  const response = await fetch("http://localhost:3000/collections", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(сollection),
  });

  const data = await response.json();
  return data as AddNewCollectionResponse;
}
